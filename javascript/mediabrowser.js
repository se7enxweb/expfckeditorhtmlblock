/**
 * mediabrowser.js — CKEditor 5 bridge for the eZ Publish media/link browser
 * popup.
 *
 * This popup is opened by ExpEzImagePlugin (window.name === 'expeZimage') or
 * ExpEzLinkPlugin (window.name !== 'expeZimage').  On submit it calls the
 * appropriate callback registered on window.opener by the plugin before the
 * popup was opened.
 */
window.onload = function () {
    var isImageMode = (window.name === 'expeZimage');

    if (document.forms[1] && document.forms[1].nurBilder) {
        document.forms[1].nurBilder.value = isImageMode ? 'true' : 'false';
    }

    if (isImageMode && document.forms[0] && document.forms[0].lien) {
        var lienField = document.forms[0].lien;
        if (lienField.title && lienField.title.indexOf('\u00e9') !== -1) {
            /* Single <select> element — disable non-image entries. */
            lienField.disabled = true;
        } else if (lienField.length) {
            for (var i = 0; i < lienField.length; i++) {
                if (lienField[i].title && lienField[i].title.indexOf('\u00e9') !== -1) {
                    lienField[i].disabled = true;
                }
            }
        }
    }
};

function Ok() {
    var link   = '';
    var width, height, imgUrl;

    /* querySelectorAll always returns a NodeList even for a single element,
       unlike document.forms[0].lien which is the element itself when count=1. */
    var radios = document.querySelectorAll('input[name=lien]');
    for (var i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            link   = radios[i].value;
            width  = radios[i].getAttribute('imgwidth')  || undefined;
            height = radios[i].getAttribute('imgheight') || undefined;
            imgUrl = radios[i].getAttribute('data-imgurl') || undefined;
            break;
        }
    }

    var isImageMode = document.forms[1] &&
                      document.forms[1].nurBilder &&
                      document.forms[1].nurBilder.value === 'true';

    if (window.opener) {
        if (!isImageMode && typeof window.opener.expCK5_onLinkSelected === 'function') {
            window.opener.expCK5_onLinkSelected(link);
        } else if (isImageMode && typeof window.opener.expCK5_onImageSelected === 'function') {
            window.opener.expCK5_onImageSelected(link, width, height, imgUrl);
        }
    }

    window.close();
    return true;
}

