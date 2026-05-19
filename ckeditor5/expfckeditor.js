/**
 * expFCKeditorHtmlblock — CKEditor 5 custom plugins and initializer.
 *
 * Provides:
 *   ExpEzLinkPlugin  — toolbar button that opens the eZ insertlink popup
 *   ExpEzImagePlugin — toolbar button that opens the eZ mediabrowser popup
 *   initExpCKEditor5 — factory that creates a ClassicEditor instance
 *
 * Popup ↔ editor communication uses window.opener callbacks registered on
 * the parent page before the popup is opened.
 *
 * Requires: ckeditor5.umd.js (CKEDITOR global) loaded before this file.
 */
(function (global) {
    'use strict';

    if (typeof global.CKEDITOR === 'undefined') {
        console.error(
            'expfckeditor.js: CKEDITOR global not found. ' +
            'Load ckeditor5.umd.js before this script.'
        );
        return;
    }

    /* ------------------------------------------------------------------ */
    /* Destructure required CKEditor 5 exports                             */
    /* ------------------------------------------------------------------ */
    var CK = global.CKEDITOR;
    var Plugin                    = CK.Plugin;
    var ButtonView                = CK.ButtonView;
    var ClassicEditor             = CK.ClassicEditor;
    var Essentials                = CK.Essentials;
    var Heading                   = CK.Heading;
    var Paragraph                 = CK.Paragraph;
    var Bold                      = CK.Bold;
    var Italic                    = CK.Italic;
    var Underline                 = CK.Underline;
    var Strikethrough             = CK.Strikethrough;
    var Subscript                 = CK.Subscript;
    var Superscript               = CK.Superscript;
    var Link                      = CK.Link;
    var AutoLink                  = CK.AutoLink;
    var List                      = CK.List;
    var Indent                    = CK.Indent;
    var IndentBlock               = CK.IndentBlock;
    var Alignment                 = CK.Alignment;
    var FontFamily                = CK.FontFamily;
    var FontSize                  = CK.FontSize;
    var FontColor                 = CK.FontColor;
    var FontBackgroundColor       = CK.FontBackgroundColor;
    var RemoveFormat              = CK.RemoveFormat;
    var SourceEditing             = CK.SourceEditing;
    var BlockQuote                = CK.BlockQuote;
    var Table                     = CK.Table;
    var TableToolbar              = CK.TableToolbar;
    var TableProperties           = CK.TableProperties;
    var TableCellProperties       = CK.TableCellProperties;
    var HorizontalLine            = CK.HorizontalLine;
    var PageBreak                 = CK.PageBreak;
    var SpecialCharacters         = CK.SpecialCharacters;
    var SpecialCharactersEssentials = CK.SpecialCharactersEssentials;
    var FindAndReplace            = CK.FindAndReplace;
    var Image                     = CK.Image;
    var ImageInsert               = CK.ImageInsert;
    var ImageInsertViaUrl         = CK.ImageInsertViaUrl;
    var ImageToolbar              = CK.ImageToolbar;
    var ImageCaption              = CK.ImageCaption;
    var ImageStyle                = CK.ImageStyle;
    var ImageResize               = CK.ImageResize;
    var LinkImage                 = CK.LinkImage;
    var MediaEmbed                = CK.MediaEmbed;

    /* ------------------------------------------------------------------ */
    /* ExpEzLinkPlugin                                                      */
    /* ------------------------------------------------------------------ */

    /**
     * Opens the eZ Publish insertlink module popup and inserts the selected
     * content object as an expobject:// anchor link.
     */
    class ExpEzLinkPlugin extends Plugin {
        static get pluginName() { return 'ExpEzLink'; }

        init() {
            var editor = this.editor;

            editor.ui.componentFactory.add('expEzLink', function (locale) {
                var button = new ButtonView(locale);
                button.set({
                    label: 'eZ Link',
                    withText: true,
                    class: 'ck-button-expezlink',
                    tooltip: 'Insert eZ Publish content link',
                    isToggleable: false
                });

                button.on('execute', function () {
                    _openEzLinkPopup(editor);
                });

                return button;
            });
        }
    }

    function _openEzLinkPopup(editor) {
        var config      = editor.config.get('ezPublish') || {};
        var siteAccess  = config.siteAccessPath || '';
        var objectId    = config.objectId       || 0;
        var version     = config.version        || 0;

        /* Register callback before opening the popup. */
        global.expCK5_onEzLinkSelected = function (selectedObjectId, caption) {
            delete global.expCK5_onEzLinkSelected;

            if (!selectedObjectId) { return; }

            var href = 'expobject://' + selectedObjectId;
            var text = caption || href;

            editor.model.change(function (writer) {
                var selection = editor.model.document.selection;
                if (!selection.isCollapsed) {
                    editor.execute('link', href);
                } else {
                    var textNode = writer.createText(text, { linkHref: href });
                    editor.model.insertContent(textNode);
                }
            });
        };

        var url = siteAccess + '/expfckeditorhtmlblock/insertlink/' + objectId + '/' + version;
        global.open(url, 'expEzLink', 'width=700,height=500,resizable=yes,scrollbars=yes');
    }

    /* ------------------------------------------------------------------ */
    /* ExpEzImagePlugin                                                     */
    /* ------------------------------------------------------------------ */

    /**
     * Opens the eZ Publish mediabrowser popup and inserts the selected media
     * as a link or image depending on context.
     *
     * The popup window name is set to 'expeZimage'; mediabrowser.js reads
     * window.name to determine whether to call the image or link callback.
     */
    class ExpEzImagePlugin extends Plugin {
        static get pluginName() { return 'ExpEzImage'; }

        init() {
            var editor = this.editor;

            editor.ui.componentFactory.add('expEzImage', function (locale) {
                var button = new ButtonView(locale);
                button.set({
                    label: 'eZ Image',
                    withText: true,
                    class: 'ck-button-expezimage',
                    tooltip: 'Insert eZ Publish image / media',
                    isToggleable: false
                });

                button.on('execute', function () {
                    _openEzImagePopup(editor);
                });

                return button;
            });
        }
    }

    function _openEzImagePopup(editor) {
        var config     = editor.config.get('ezPublish') || {};
        var siteAccess = config.siteAccessPath || '';

        /* Image callback — invoked by mediabrowser.js in image mode. */
        global.expCK5_onImageSelected = function (ezObject, width, height, imgUrl) {
            delete global.expCK5_onImageSelected;
            if (!ezObject) { return; }
            var src = imgUrl || ezObject;
            editor.execute('insertImage', { source: src });
        };

        /* Link callback — invoked by mediabrowser.js in link mode. */
        global.expCK5_onLinkSelected = function (href) {
            delete global.expCK5_onLinkSelected;
            if (!href) { return; }
            editor.model.change(function (writer) {
                var selection = editor.model.document.selection;
                if (!selection.isCollapsed) {
                    editor.execute('link', href);
                } else {
                    var textNode = writer.createText(href, { linkHref: href });
                    editor.model.insertContent(textNode);
                }
            });
        };

        /* The window name 'expeZimage' signals image mode to mediabrowser.js.
           The layout must be 'mediabrowser' (registered in layout.ini.append.php). */
        var url = siteAccess + '/layout/set/mediabrowser/(dispnodeid)/2';
        global.open(url, 'expeZimage', 'width=820,height=540,resizable=yes,scrollbars=yes');
    }

    /* ------------------------------------------------------------------ */
    /* initExpCKEditor5                                                     */
    /* ------------------------------------------------------------------ */

    /**
     * Creates a ClassicEditor instance for an ezhtml datatype textarea.
     *
     * @param {string} textareaId   ID of the <textarea> element
     * @param {object} ezConfig     { siteAccessPath, objectId, version, height }
     * @returns {Promise<ClassicEditor>}
     */
    function initExpCKEditor5(textareaId, ezConfig) {
        var textarea = document.getElementById(textareaId);
        if (!textarea) {
            console.warn('initExpCKEditor5: textarea #' + textareaId + ' not found');
            return Promise.reject(new Error('Textarea not found: ' + textareaId));
        }

        var height = (ezConfig && ezConfig.height > 0) ? Number(ezConfig.height) : 400;

        return ClassicEditor.create(textarea, {
            licenseKey: 'GPL',
            plugins: [
                Essentials,
                Heading,
                Paragraph,
                Bold, Italic, Underline, Strikethrough,
                Subscript, Superscript,
                Link, AutoLink,
                List, Indent, IndentBlock,
                Alignment,
                FontFamily, FontSize, FontColor, FontBackgroundColor,
                RemoveFormat,
                SourceEditing,
                BlockQuote,
                Table, TableToolbar, TableProperties, TableCellProperties,
                HorizontalLine,
                PageBreak,
                SpecialCharacters, SpecialCharactersEssentials,
                FindAndReplace,
                Image, ImageInsert, ImageInsertViaUrl,
                ImageToolbar, ImageCaption, ImageStyle, ImageResize,
                LinkImage,
                MediaEmbed,
                ExpEzLinkPlugin,
                ExpEzImagePlugin
            ],

            toolbar: {
                items: [
                    'undo', 'redo',
                    '|',
                    'heading',
                    '|',
                    'bold', 'italic', 'underline', 'strikethrough',
                    'subscript', 'superscript',
                    '|',
                    'link', 'expEzLink', 'expEzImage',
                    '|',
                    'bulletedList', 'numberedList',
                    'outdent', 'indent',
                    '|',
                    'alignment',
                    '|',
                    'fontFamily', 'fontSize', 'fontColor', 'fontBackgroundColor',
                    '|',
                    'insertTable',
                    '|',
                    'insertImage', 'mediaEmbed',
                    '|',
                    'blockQuote', 'horizontalLine', 'pageBreak',
                    '|',
                    'specialCharacters',
                    '|',
                    'removeFormat',
                    '|',
                    'findAndReplace',
                    '|',
                    'sourceEditing'
                ],
                shouldNotGroupWhenFull: false
            },

            table: {
                contentToolbar: [
                    'tableColumn', 'tableRow', 'mergeTableCells',
                    'tableProperties', 'tableCellProperties'
                ]
            },

            image: {
                toolbar: [
                    'imageStyle:inline',
                    'imageStyle:block',
                    'imageStyle:side',
                    '|',
                    'toggleImageCaption',
                    'imageTextAlternative',
                    '|',
                    'linkImage'
                ]
            },

            link: {
                defaultProtocol: 'https://',
                decorators: {
                    openInNewTab: {
                        mode: 'manual',
                        label: 'Open in new tab',
                        attributes: {
                            target: '_blank',
                            rel: 'noopener noreferrer'
                        }
                    }
                }
            },

            heading: {
                options: [
                    { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
                    { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
                    { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
                    { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
                    { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
                    { model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' },
                    { model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6' }
                ]
            },

            ezPublish: ezConfig || {}

        }).then(function (editor) {

            /* Sync content back to the textarea on every change so that the
               eZ Publish form submission picks up the latest HTML. */
            editor.model.document.on('change:data', function () {
                textarea.value = editor.getData();
            });

            /* Apply the configured height to the editable area. */
            var editable = editor.ui.view.editable && editor.ui.view.editable.element;
            if (editable) {
                editable.style.minHeight = height + 'px';
            }

            /* Store the editor instance on the textarea element for later
               external access (e.g. form-submit handlers). */
            textarea._ck5Editor = editor;

            return editor;

        }).catch(function (err) {
            console.error('CKEditor 5 init error (textarea #' + textareaId + '):', err);
        });
    }

    /* ------------------------------------------------------------------ */
    /* Expose on global scope                                               */
    /* ------------------------------------------------------------------ */

    global.initExpCKEditor5 = initExpCKEditor5;
    global.ExpEzLinkPlugin   = ExpEzLinkPlugin;
    global.ExpEzImagePlugin  = ExpEzImagePlugin;

}(typeof globalThis !== 'undefined' ? globalThis : window));
