/** @type {AppTypes.Config} */
// TeleRAD — OHIF behind the viewer host's nginx + viewer-auth, Orthanc via the container's nginx
// (/dicom-web and /wado proxied to orthanc-pacs:8042). Ported from the TeleRAD branch (OHIF 3.8):
// custom viewport overlay (4 corners) and the "Toggle overlay" toolbar button.

const overlayItem = (id, title, condition, contentF, label = '') => ({
  id,
  inheritsFrom: 'ohif.overlayItem',
  label,
  title,
  condition,
  contentF,
});

window.config = {
  routerBasename: null,
  // Users only reach the viewer from the TeleRAD site, one study at a time.
  showStudyList: false,
  investigationalUseDialog: {
    option: 'never',
  },
  extensions: [],
  modes: [],
  // some windows systems have issues with more than 3 web workers
  maxNumberOfWebWorkers: 3,
  maxNumRequests: {
    interaction: 100,
    thumbnail: 75,
    // HTTP/2 between browser and nginx: prefetch can be higher.
    prefetch: 25,
  },
  showWarningMessageForCrossOrigin: true,
  showCPUFallbackMessage: true,
  showLoadingIndicator: true,
  strictZSpacingForVolumeViewport: true,
  studyPrefetcher: {
    enabled: true,
    displaySetsCount: 2,
    maxNumPrefetchRequests: 10,
    order: 'closest',
  },
  defaultDataSourceName: 'dicomweb',
  dataSources: [
    {
      namespace: '@ohif/extension-default.dataSourcesModule.dicomweb',
      sourceName: 'dicomweb',
      configuration: {
        friendlyName: 'Orthanc Server',
        name: 'Orthanc',
        wadoUriRoot: '/wado',
        qidoRoot: '/dicom-web',
        wadoRoot: '/dicom-web',
        qidoSupportsIncludeField: false,
        imageRendering: 'wadors',
        thumbnailRendering: 'wadors',
        omitQuotationForMultipartRequest: true,
      },
    },
  ],

  customizationService: [
    {
      'viewportOverlay.topLeft': {
        $set: [
          overlayItem(
            'PatientNameOverlay',
            'Patient Name',
            ({ referenceInstance }) => referenceInstance?.PatientName,
            ({ referenceInstance, formatters: { formatPN } }) =>
              formatPN(referenceInstance.PatientName.Alphabetic ?? referenceInstance.PatientName),
            'PN:'
          ),
          overlayItem(
            'PatientIDOverlay',
            'Patient ID',
            ({ referenceInstance }) => referenceInstance?.PatientID,
            ({ referenceInstance }) => referenceInstance.PatientID,
            'ID:'
          ),
          overlayItem(
            'DataNascOverlay',
            'Data Nascimento',
            ({ referenceInstance }) => referenceInstance?.PatientBirthDate,
            ({ referenceInstance, formatters: { formatDate } }) =>
              formatDate(referenceInstance.PatientBirthDate) +
              (referenceInstance.PatientSex ? ' - ' + referenceInstance.PatientSex : '')
          ),
        ],
      },
    },
    {
      'viewportOverlay.topRight': {
        $set: [
          overlayItem(
            'StudyDescOverlay',
            'StudyDescription',
            ({ referenceInstance }) => referenceInstance?.StudyDescription,
            ({ referenceInstance }) => referenceInstance.StudyDescription
          ),
          overlayItem(
            'StudyDate',
            'Study date',
            ({ referenceInstance }) => referenceInstance?.StudyDate,
            ({ referenceInstance, formatters: { formatDate, formatTime } }) =>
              formatDate(referenceInstance.StudyDate) +
              (referenceInstance.StudyTime ? ` - ${formatTime(referenceInstance.StudyTime)}` : '')
          ),
          overlayItem(
            'SeriesDescription',
            'Series description',
            ({ referenceInstance }) => referenceInstance?.SeriesDescription,
            ({ referenceInstance }) => referenceInstance.SeriesDescription
          ),
        ],
      },
    },
    {
      'viewportOverlay.bottomLeft': {
        $set: [
          overlayItem(
            'SliceThickness',
            'SliceThickness',
            ({ referenceInstance }) => referenceInstance?.SliceThickness,
            ({ referenceInstance: i }) =>
              i.SliceThickness +
              ' mm' +
              (i.SpacingBetweenSlices ? ' - SBS: ' + i.SpacingBetweenSlices + ' mm' : '') +
              (i.SliceLocation ? ' - Location: ' + i.SliceLocation + ' mm' : ''),
            'Thickness:'
          ),
          overlayItem(
            'RepetitionTime',
            'Repetition Time',
            ({ referenceInstance: i }) => i && (i.EchoTime || i.RepetitionTime),
            ({ referenceInstance: i }) =>
              (i.RepetitionTime ? 'TR: ' + i.RepetitionTime + ' ms' : '') +
              (i.EchoTime ? ' - TE: ' + i.EchoTime + ' ms' : '')
          ),
          overlayItem(
            'FieldStrength',
            'Field Strength',
            ({ referenceInstance }) => referenceInstance?.MagneticFieldStrength,
            ({ referenceInstance: i }) =>
              i.MagneticFieldStrength + ' T' + (i.FlipAngle ? ' - FA: ' + i.FlipAngle : '')
          ),
          overlayItem(
            'Modality',
            'Modality',
            ({ referenceInstance }) => referenceInstance?.Modality,
            ({ referenceInstance }) => referenceInstance.Modality
          ),
          {
            id: 'InstanceNumber',
            inheritsFrom: 'ohif.overlayItem.instanceNumber',
            title: 'Instance Number',
          },
        ],
      },
    },
    {
      'viewportOverlay.bottomRight': {
        $set: [
          {
            id: 'WindowLevel',
            inheritsFrom: 'ohif.overlayItem.windowLevel',
            title: 'Window Level',
          },
          {
            id: 'ZoomLevel',
            inheritsFrom: 'ohif.overlayItem.zoomLevel',
          },
        ],
      },
    },
    {
      'cornerstone.toolbarButtons': {
        $push: [
          {
            id: 'ToggleOverlay',
            uiType: 'ohif.toolButton',
            props: {
              icon: 'toggle-dicom-overlay',
              label: 'Toggle overlay',
              tooltip: 'Mostrar/ocultar informações sobre a imagem',
              commands: 'toggleOverlays',
              evaluate: 'evaluate.action',
            },
          },
        ],
      },
    },
    {
      // Right after "Capture", as in the 3.8 TeleRAD build.
      'cornerstone.toolbarSections': {
        primary: { $apply: list => insertAfter(list, 'Capture', 'ToggleOverlay') },
      },
    },
  ],
};

function insertAfter(list, after, id) {
  if (!Array.isArray(list) || list.includes(id)) {
    return list;
  }
  const i = list.indexOf(after);
  return i < 0 ? [...list, id] : [...list.slice(0, i + 1), id, ...list.slice(i + 1)];
}
