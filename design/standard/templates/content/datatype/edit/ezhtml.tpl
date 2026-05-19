{*
//
// Copyright (C) 2005 Smile. All rights reserved.
//
// Authors:
//   Julian Roblin <julian.roblin@smile.fr>
//
// This source file is part of the eZ publish (tm) Open Source Content
// Management System.
//
// This file may be distributed and/or modified under the terms of the
// "GNU General Public License" version 2 as published by the Free
// Software Foundation and appearing in the file LICENSE included in
// the packaging of this file.
//
// Licencees holding a valid "eZ publish professional licence" version 2
// may use this file in accordance with the "eZ publish professional licence"
// version 2 Agreement provided with the Software.
//
// This file is provided AS IS with NO WARRANTY OF ANY KIND, INCLUDING
// THE WARRANTY OF DESIGN, MERCHANTABILITY AND FITNESS FOR A PARTICULAR
// PURPOSE.
//
// The "eZ publish professional licence" version 2 is available at
// http://ez.no/ez_publish/licences/professional/ and in the file
// PROFESSIONAL_LICENCE included in the packaging of this file.
// For pricing of this licence please contact us via e-mail to licence@ez.no.
// Further contact information is available at http://ez.no/company/contact/.
//
// The "GNU General Public License" (GPL) is available at
// http://www.gnu.org/copyleft/gpl.html.
//
// Contact licence@ez.no if any conditions of this licencing isn't clear to
// you.
//
*}

{default attribute_base='ContentObjectAttribute' html_class='full'}

<link rel="stylesheet" href={'/extension/expfckeditorhtmlblock/ckeditor5/ckeditor5.css'|ezroot}>
<script src={'/extension/expfckeditorhtmlblock/ckeditor5/ckeditor5.umd.js'|ezroot}></script>
<script src={'/extension/expfckeditorhtmlblock/ckeditor5/expfckeditor.js'|ezroot}></script>

<textarea id="{$attribute_base}_fcke_{$attribute.id}"
          class="{eq( $html_class, 'half' )|choose( 'box', 'halfbox' )}"
          name="{$attribute_base}_data_text_{$attribute.id}"
          cols="70">{$attribute.content|wash}</textarea>

<script>
{literal}
(function () {
{/literal}
    var textareaId = '{$attribute_base}_fcke_{$attribute.id}';
    var ezConfig = {literal}{
        siteAccessPath : '{/literal}{ezsys('indexdir')}{literal}',
        objectId       : {/literal}{$attribute.contentobject_id}{literal},
        version        : {/literal}{$attribute.version}{literal},
        height         : {/literal}{$attribute.contentclass_attribute.data_int1|mul(20)}{literal}
    };

    function start() {
        if (typeof initExpCKEditor5 === 'function') {
            initExpCKEditor5(textareaId, ezConfig);
        } else {
            console.error('initExpCKEditor5 not found \u2014 check that expfckeditor.js loaded correctly.');
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
}());
{/literal}
</script>
{/default}

