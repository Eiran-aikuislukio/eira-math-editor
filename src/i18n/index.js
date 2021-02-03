/**
 * A simple dictionary to easier translate texts in future, currently only in Finnish
 */

// eslint-disable-next-line no-unused-vars
const EN = {
  NEW_ANSWER: 'New answer',
  DOWNLOAD: 'Download',
  DELETE: 'Delete',
  CANCEL: 'Cancel',
  OPEN_FILE: 'Open file',
  CONFIRM_DELETE: 'Confirm delete',
  CONFIRM_DELETE_SELECTED:
    'Are you sure you want to delete the selected answers? This action can not be undone.',
  ARE_YOU_SURE_YOU_WANT_TO_DELETE:
    'Are you sure you want to delete this answer? This action can not be undone.',

  INVALID_FILE:
    'File not recognised, please upload a file that has been created with this editor',
  INVALID_FILE_FORMAT:
    'Invalid file, please upload a file that has been created with this editor',
  FILE_UPLOAD_SUCCESS: 'File uploaded successfully',

  CHOOSE_A_FILE: 'Choose a file',
  OR_DRAG_IT_HERE: 'or drag it here',
  CHOOSE_A_FILE_INSTRUCTIONS: (
    <>
      Please choose a JSON file saved from the Eira editor, e.g.{' '}
      <code>math-editor.json</code>
    </>
  ),
  TITLE: 'Title',
  COPY_TO_CLIPBOARD: 'Copy to clipboard',
  COPIED_TO_CLIPBOARD: 'Copied to clipboard',
  FAILED_TO_COPY_TO_CLIPBOARD: 'Failed to copy to clipboard',
  DOWNLOAD_FILE: 'Download file',
  SAVE_IMAGE: 'Save as image',
  SAVE_PDF: 'Save as PDF',
  OPEN_MENU: 'Open menu',
  TOGGLE_SIDEBAR: 'Toggle sidebar',
}

const FI = {
  NEW_ANSWER: 'Uusi vastaus',
  DOWNLOAD: 'Tallenna',
  DELETE: 'Poista',
  CANCEL: 'Peruuta',
  OPEN_FILE: 'Avaa',
  CONFIRM_DELETE: 'Varmista poisto',
  CONFIRM_DELETE_SELECTED:
    'Haluatko varmasti poistaa valitut vastaukset? Toimintoa ei voi perua.',
  ARE_YOU_SURE_YOU_WANT_TO_DELETE:
    'Haluatko varmasti poistaa vastauksen? Toimintoa ei voi perua.',

  INVALID_FILE:
    'Tiedostoa ei tunnistettu. Valitse tiedosto, joka on tehty tällä editorilla.',
  INVALID_FILE_FORMAT:
    'Virheellinen tiedosto. Valitse tiedosto, joka on tehty tällä editorilla.',
  FILE_UPLOAD_SUCCESS: 'Tiedosto ladattu onnistuneesti',

  CHOOSE_A_FILE: 'Valitse tiedosto',
  OR_DRAG_IT_HERE: 'tai raahaa se tähän',
  CHOOSE_A_FILE_INSTRUCTIONS: (
    <>
      Valitse JSON tiedosto, joka on tallennettu Eira editorista. esim.{' '}
      <code>math-editor.json</code>
    </>
  ),
  TITLE: 'Otsikko',
  COPY_TO_CLIPBOARD: 'Kopioi leikepöydälle',
  COPIED_TO_CLIPBOARD: 'Sisältö kopioitu leikepöydälle',
  FAILED_TO_COPY_TO_CLIPBOARD: 'Kopiointi ei onnistu',
  DOWNLOAD_FILE: 'Tallenna tiedostona',
  SAVE_IMAGE: 'Tallenna kuvana',
  SAVE_PDF: 'Tallenna PDF',
  OPEN_MENU: 'Avaa valikko',
  TOGGLE_SIDEBAR: 'Vaihda sivupalkki',
}

const t = (key) => FI[key] || key

export default t
