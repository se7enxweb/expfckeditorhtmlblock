{* set-block scope=root variable=cache_ttl}0{/set-block *}

<!DOCTYPE html>
<html lang="no">

<head>
<meta charset="utf-8">
<title>Media browser</title>

{let node=fetch(content, node, hash(node_id, $module_result.node_id))}

<style type="text/css">
    @import url({'stylesheets/core.css'|ezdesign});
    @import url({'stylesheets/debug.css'|ezdesign});
    @import url({'stylesheets/treemenu.css'|ezdesign});
</style>

</head>

<body>

<div class="content-view-children">

<!-- Children START -->

<script src={'/extension/expfckeditorhtmlblock/javascript/mediabrowser.js'|ezroot} type="text/javascript"></script>



{def 	$nodemain = fetch( content, node, hash(node_id, 1))
		$nodeidindex = 0
		$myindex = 0
		$offsetindex = 0}

{foreach $module_result.uri|explode('/') as $component}
	{if $component|eq('(dispnodeid)')}
		{set $nodeidindex=$myindex|sum(1)}
	{/if}
	{if $component|eq('(offset)')}
		{set $offsetindex=$myindex|sum(1)}
	{/if}
	{set $myindex = $myindex|sum(1)}
{/foreach}

{def 	$dispnodeid = $module_result.uri|explode('/').$nodeidindex
		$dispnode = fetch( content, node, hash(node_id, $dispnodeid))
		$offset = $module_result.uri|explode('/').$offsetindex}
<div class="context-block">
<input type="hidden" name="ContentNodeID" value="{$dispnode.node_id}" />
{* Generic children list for admin interface. *}
{let item_type=ezpreference( 'admin_list_limit' )
     number_of_items=min( $item_type, 3)|choose( 10, 10, 25, 50 )
     can_remove=false()
     can_edit=false()
     can_create=false()
     can_copy=false()
     children_count=$dispnode.children_count
     children=fetch( content, list, hash( parent_node_id, $dispnode.node_id,
                                          sort_by, $dispnode.sort_array,
                                          limit, $number_of_items,
                                          offset, $offset ) ) }


{* DESIGN: Header START *}<div class="box-header"><div class="box-tc"><div class="box-ml"><div class="box-mr"><div class="box-tl"><div class="box-tr">

{if $dispnode|ne($nodemain)}
     <a href={concat('layout/set/mediabrowser/(dispnodeid)/',$dispnode.parent_node_id)|ezurl(no)}>
      <img src={'back-button-16x16.gif'|ezimage} alt='Niveau pr�c�dent'></a>&nbsp;
{/if}
{undef $nodemain}
	<b>
    {$dispnode.name}
  </b>
{* DESIGN: Subline *}<div class="header-subline"></div>

{* DESIGN: Header END *}</div></div></div></div></div></div>

{* DESIGN: Content START *}<div class="box-ml"><div class="box-mr"><div class="box-content">

{* If there are children: show list and buttons that belong to the list. *}
{section show=$children}

{* Items per page and view mode selector. *}
<div class="context-toolbar">
<div class="block">
<div class="left">
    <p>
    {switch match=$number_of_items}
    {case match=25}
        <a href={'/user/preferences/set/admin_list_limit/1'|ezurl} title="{'Show 10 items per page.'|i18n( 'design/admin/node/view/full' )}">10</a>
        <span class="current">25</span>
        <a href={'/user/preferences/set/admin_list_limit/3'|ezurl} title="{'Show 50 items per page.'|i18n( 'design/admin/node/view/full' )}">50</a>

        {/case}

        {case match=50}
        <a href={'/user/preferences/set/admin_list_limit/1'|ezurl} title="{'Show 10 items per page.'|i18n( 'design/admin/node/view/full' )}">10</a>
        <a href={'/user/preferences/set/admin_list_limit/2'|ezurl} title="{'Show 25 items per page.'|i18n( 'design/admin/node/view/full' )}">25</a>
        <span class="current">50</span>
        {/case}

        {case}
        <span class="current">10</span>
        <a href={'/user/preferences/set/admin_list_limit/2'|ezurl} title="{'Show 25 items per page.'|i18n( 'design/admin/node/view/full' )}">25</a>
        <a href={'/user/preferences/set/admin_list_limit/3'|ezurl} title="{'Show 50 items per page.'|i18n( 'design/admin/node/view/full' )}">50</a>
        {/case}

        {/switch}
    </p>
</div>
<div class="right">
        <p>
        {switch match=ezpreference( 'admin_children_viewmode' )}
        {case match='thumbnail'}
        <a href={'/user/preferences/set/admin_children_viewmode/list'|ezurl} title="{'Display sub items using a simple list.'|i18n( 'design/admin/node/view/full' )}">{'List'|i18n( 'design/admin/node/view/full' )}</a>
        <span class="current">{'Thumbnail'|i18n( 'design/admin/node/view/full' )}</span>
        <a href={'/user/preferences/set/admin_children_viewmode/detailed'|ezurl} title="{'Display sub items using a detailed list.'|i18n( 'design/admin/node/view/full' )}">{'Detailed'|i18n( 'design/admin/node/view/full' )}</a>
        {/case}

        {case match='detailed'}
        <a href={'/user/preferences/set/admin_children_viewmode/list'|ezurl} title="{'Display sub items using a simple list.'|i18n( 'design/admin/node/view/full' )}">{'List'|i18n( 'design/admin/node/view/full' )}</a>
        <a href={'/user/preferences/set/admin_children_viewmode/thumbnail'|ezurl} title="{'Display sub items as thumbnails.'|i18n( 'design/admin/node/view/full' )}">{'Thumbnail'|i18n( 'design/admin/node/view/full' )}</a>
        <span class="current">{'Detailed'|i18n( 'design/admin/node/view/full' )}</span>
        {/case}

        {case}
        <span class="current">{'List'|i18n( 'design/admin/node/view/full' )}</span>
        <a href={'/user/preferences/set/admin_children_viewmode/thumbnail'|ezurl} title="{'Display sub items as thumbnails.'|i18n( 'design/admin/node/view/full' )}">{'Thumbnail'|i18n( 'design/admin/node/view/full' )}</a>
        <a href={'/user/preferences/set/admin_children_viewmode/detailed'|ezurl} title="{'Display sub items using a detailed list.'|i18n( 'design/admin/node/view/full' )}">{'Detailed'|i18n( 'design/admin/node/view/full' )}</a>
        {/case}
        {/switch}
        </p>
</div>

<div class="break"></div>

</div>
</div>

    {* Copying operation is allowed if the user can create stuff under the current node. *}
    {set can_copy=$dispnode.can_create}


{* Display the actual list of nodes. *}
{switch match=ezpreference( 'admin_children_viewmode' )}

{case match='thumbnail'}
    {include uri='design:mediabrowser_full_thumbnail.tpl'}
{/case}

{case match='detailed'}
    {include uri='design:mediabrowser_full_detailed.tpl'}
{/case}

{case}
    {include uri='design:mediabrowser_full_list.tpl'}
{/case}
{/switch}

{include name=navigator
         uri='design:navigator/google.tpl'
         page_uri=concat("/(dispnodeid)/",$dispnodeid)
         item_count=$children_count
         view_parameters=hash('offset', $offset|int)
         item_limit=$number_of_items
         node_id=$Nodes.item.node_id}


{* Else: there are no children. *}
{section-else}

<div class="block">
    <p>The current item does not contain any sub items.</p>
</div>

{/section}

{* DESIGN: Content END *}</div></div></div>


{* Button bar for remove and update priorities buttons. *}
<div class="controlbar">

{* DESIGN: Control bar START *}<div class="box-bc"><div class="box-ml"><div class="box-mr"><div class="box-tc"><div class="box-bl"><div class="box-br">

</div>

<div class="block">
<input type="button" value="OK" onclick="Ok(); return false;" />
{* DESIGN: Control bar END *}</div></div></div></div></div></div>

</div>

</div>

<!-- Children END -->
{undef $nodemain $nodeidindex $myindex $offsetindex}
{undef $dispnodeid $dispnode $offset}

{/let}
</div>
<form name="nurBilder">
	<input type="hidden" name="nurBilder">
</form>

</body>
</html>
{/let}