const DICTIONARY = {
  NEW_ANSWER: 'New answer',
  DOWNLOAD: 'Download',
  DELETE: 'Delete',
  CANCEL: 'Cancel',
  OPEN_FILE: 'Open file',
  CONFIRM_DELETE: 'Confirm delete',
  ARE_YOU_SURE_YOU_WANT_TO_DELETE:
    'Are you sure you want to delete this answer? This action can not be undone.',

  INVALID_FILE:
    'File not recognised, please upload a file that has been created with this editor',
  INVALID_FILE_FORMAT:
    'Invalid file, please upload a file that has been created with this editor',
  PLEASE_UPLOAD_A_FILE: 'Please upload a json file created with this editor',
  FILE_UPLOAD_SUCCESS: 'Looks good',

  CHOOSE_A_FILE: 'Choose a file',
  OR_DRAG_IT_HERE: 'or drag it here',
  CHOOSE_A_FILE_INSTRUCTIONS: (
    <>
      Please choose a JSON file saved from the Eira editor, e.g.{' '}
      <code>math-editor.json</code>
    </>
  ),
}

const t = (key) => DICTIONARY[key] || key

export default t
