<tbody class="nestedps" data-level="root">
	<tr><th colspan="5" class="h2 primary_sources">Primary sources - {{count($newnestedprimary['root'])}}</th></tr>
	<tr>
		<th>Name</th>
		<th><!-- show reference--></th>
		<th>Links</th>
		<th></th>
		<th></th>
		<th></th>
	</tr>
	@foreach($newnestedprimary['root'] as $key)
		<tr class="oddeven openable" data-relatedlevel="{{$key}}">
			<td>{{$key}} <i class="fa fa-caret-right"></i></td>
			<td><a href="#" class="show_refs" data-type="{{$resultType}}" data-id="{{$oid}}" data-reftype="{{$type}}" data-refcat="{{$cat}}" data-refid="{{$key}}">Show reference{{$newnestedprimary['counts'][$key]>1?'s':''}} ({{$newnestedprimary['counts'][$key]}})</a></td>
			<td></td>
			<td></td>
			<td></td>
			<td></td>
		</tr>
	@endforeach
</tbody>
@include('details._tables.citations.newnestedprimary')
