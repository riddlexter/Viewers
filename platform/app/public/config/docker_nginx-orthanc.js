/** @type {AppTypes.Config} */

window.config = {
  routerBasename: '/',
  customizationService: {
    cornerstoneOverlayTopLeft: {
      id: 'cornerstoneOverlayTopLeft',
      items: [
        {
          id: 'PatientNameOverlay',
          customizationType: 'ohif.overlayItem',
          label: 'PN:',
          title: 'Patient Name',
          condition: ({ instance }) =>
            instance && instance.PatientName && instance.PatientName.Alphabetic,
          contentF: ({ instance, formatters: { formatPN } }) =>
            formatPN(instance.PatientName.Alphabetic),
        },
        {
          id: 'PatientIDOverlay',
          customizationType: 'ohif.overlayItem',
          label: 'ID:',
          title: 'Patient ID',
          condition: ({ instance }) => instance && instance.PatientID,
          contentF: ({ instance }) => instance.PatientID,
        },
        {
          id: 'DataNascOverlay',
          customizationType: 'ohif.overlayItem',
          label: '',
          title: 'Data Nascimento',
          condition: ({ instance }) => instance && instance.PatientBirthDate,
          contentF: ({ instance, formatters: { formatDate } }) =>
            formatDate(instance.PatientBirthDate) +
            (instance.PatientSex ? ' - ' + instance.PatientSex : ''),
        },
      ],
    },
    cornerstoneOverlayTopRight: {
      id: 'cornerstoneOverlayTopRight',
      items: [
        {
          id: 'StudyDescOverlay',
          customizationType: 'ohif.overlayItem',
          title: 'StudyDescription',
          condition: ({ instance }) => instance && instance.StudyDescription,
          contentF: ({ instance }) => instance.StudyDescription,
        },
        {
          id: 'StudyDate',
          customizationType: 'ohif.overlayItem',
          label: '',
          title: 'Study date',
          condition: ({ instance }) => instance && instance.StudyDate,
          contentF: ({ instance, formatters: { formatDate, formatTime } }) =>
            formatDate(instance.StudyDate) +
            (instance.StudyTime ? ` - ${formatTime(instance.StudyTime)}` : ''),
        },
        {
          id: 'SeriesDescription',
          customizationType: 'ohif.overlayItem',
          label: '',
          title: 'Series description',
          attribute: 'SeriesDescription',
          condition: ({ instance }) => {
            return instance && instance.SeriesDescription;
          },
        },
      ],
    },
    cornerstoneOverlayBottomLeft: {
      id: 'cornerstoneOverlayBottomLeft',
      items: [
        {
          id: 'Slice Thickness',
          customizationType: 'ohif.overlayItem',
          label: 'Thickness:',
          title: 'SliceThickness',
          condition: ({ instance }) => {
            return instance && instance.SliceThickness;
          },
          contentF: ({ instance }) => {
            const text =
              instance.SliceThickness +
              ' mm' +
              (instance.SpacingBetweenSlices
                ? ' - SBS: ' + instance.SpacingBetweenSlices + ' mm'
                : '') +
              (instance.SliceLocation ? ' - Location: ' + instance.SliceLocation + ' mm' : '');
            return text;
          },
        },
        {
          id: 'Repetition Time',
          customizationType: 'ohif.overlayItem',
          label: '',
          title: 'Repetition Time',
          condition: ({ instance }) => {
            return instance && (instance.EchoTime || instance.RepetitionTime);
          },
          contentF: ({ instance }) => {
            const text =
              (instance.RepetitionTime ? 'TR: ' + instance.RepetitionTime + ' ms' : '') +
              (instance.EchoTime ? ' - TE: ' + instance.EchoTime + ' ms' : '');
            return text;
          },
        },
        {
          id: 'Field Strength',
          customizationType: 'ohif.overlayItem',
          label: '',
          title: 'Field Strength',
          condition: ({ instance }) => {
            return instance && instance.MagneticFieldStrength;
          },
          contentF: ({ instance }) => {
            const text =
              instance.MagneticFieldStrength +
              ' T' +
              (instance.FlipAngle ? ' - FA: ' + instance.FlipAngle : '');
            return text;
          },
        },
        {
          id: 'Modality',
          customizationType: 'ohif.overlayItem',
          label: '',
          title: 'Modality',
          condition: ({ instance }) => {
            return instance && instance.Modality;
          },
          contentF: ({ instance }) => instance.Modality,
        },
        {
          id: 'InstanceNumber',
          customizationType: 'ohif.overlayItem.instanceNumber',
        },
      ],
    },
    cornerstoneOverlayBottomRight: {
      id: 'cornerstoneOverlayBottomRight',
      items: [
        {
          id: 'WindowLevel',
          customizationType: 'ohif.overlayItem.windowLevel',
        },
        {
          id: 'ZoomLevel',
          customizationType: 'ohif.overlayItem.zoomLevel',
          condition: () => {
            return true;
          },
        },
      ],
    },
  },
  showStudyList: false,
  investigationalUseDialog: {
    option: 'never',
  },
  // some windows systems have issues with more than 3 web workers
  maxNumberOfWebWorkers: 3,
  maxNumRequests: {
    interaction: 100,
    thumbnail: 75,
    // Prefetch number is dependent on the http protocol. For http 2 or
    // above, the number of requests can be go a lot higher.
    prefetch: 25,
  },
  extensions: [],
  modes: [],
  // below flag is for performance reasons, but it might not work for all servers
  showWarningMessageForCrossOrigin: true,
  showCPUFallbackMessage: true,
  showLoadingIndicator: true,
  strictZSpacingForVolumeViewport: true,
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
    {
      namespace: '@ohif/extension-default.dataSourcesModule.dicomjson',
      sourceName: 'dicomjson',
      configuration: {
        friendlyName: 'dicom json',
        name: 'json',
      },
    },
    {
      namespace: '@ohif/extension-default.dataSourcesModule.dicomlocal',
      sourceName: 'dicomlocal',
      configuration: {
        friendlyName: 'dicom local',
      },
    },
  ],
};
