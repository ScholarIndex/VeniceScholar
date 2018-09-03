{{--*/ $current = $what; /*--}}
<tbody class="nestedps" data-level="{{$current}}">
	@if($what=='root')
		<tr><th colspan=5 class="h2 primary_sources">Primary sources - {{count($nestedprimary[$current])}}</th></tr>
	@elseif(isset($nestedprimary['ps'][$what]))
		<tr><th colspan=5 class="h2 primary_sources">Primary sources <span>{{$nestedprimary['ps'][$current]->archive}} > {{$nestedprimary['ps'][$current]->label}} <i class="fa fa-chevron-up" data-relatedlevel="{{$parent}}"></i></span></th></tr>
	@else
		<tr><th colspan=5 class="h2 primary_sources">Primary sources <span>{{$current}} <i class="fa fa-chevron-up" data-relatedlevel="{{$parent}}"></i></span></th></tr>
	@endif

	@if(count($nestedprimary[$current])==0)
		<tr><td style="text-align:center" colspan="6">No citation found</td></tr>
	@else
	<tr>
		<th>Name</th>
		<th><!-- show reference--></th>
		<th>Links</th>
		<th></th>
		<th></th>
		<th></th>
	</tr>

	@foreach($nestedprimary[$current] as $k => $v)


		@if(is_object($v))
			<tr class="oddeven">
				<td>{{$v->label}}</td>
				<td><a href="#" class="show_refs" data-type="{{$resultType}}" data-id="{{$oid}}" data-reftype="{{$type}}" data-refcat="{{$cat}}" data-refid="{{$v->id}}">Show reference{{count($v->incoming_references)>1?'s':''}} ({{count($v->incoming_references)}})</a></td>
				<td><a href="#details={{$v->id}}&rT=primary_sources&type=citing&refcat=&refid=" target="_blank" class="vscholar_lnk">VScholar</a></td>
				<td></td>
				<td></td>
				<td></td>
			</tr>

		@else

			<tr class="oddeven openable" data-relatedlevel="{{$k}}">
				@if(isset($nestedprimary['ps'][$k]))
					<td><span class='label'>{{ucfirst($nestedprimary['ps'][$k]->type)}}</span> {{$nestedprimary['ps'][$k]->label}} <i class="fa fa-caret-right"></i></td>
				@else
					<td>{{$k}} <i class="fa fa-caret-right"></i></td>
				@endif
				<td><a href="#" class="show_refs" data-type="{{$resultType}}" data-id="{{$oid}}" data-reftype="{{$type}}" data-refcat="{{$cat}}" data-refid="{{$k}}">Show reference{{$v>1?'s':''}} ({{$v}})</a></td>
				@if(isset($nestedprimary['ps'][$k]))
					<td><a href="#details={{$k}}&rT=primary_sources&type=citing&refcat=&refid=" class="vscholar_lnk">VScholar</a></td>
				@else
					<td></td>
				@endif
				<td></td>
				<td></td>
				<td></td>
			</tr>
			{{--*/ $what=$k;$parent=$current; /*--}}
			@push($current)
			    @include('details._tables.citations.nestedprimary')
			@endpush

		@endif


	@endforeach
	@endif
</tbody>
@stack($current)
