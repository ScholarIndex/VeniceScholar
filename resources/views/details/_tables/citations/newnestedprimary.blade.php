@foreach($newnestedprimary['flathierarchy'] as $key => $table)
	<tbody class="nestedps" data-level="{{$key}}">
		<tr>
			<th colspan=5 class="h2 primary_sources">
				Primary sources - {{count($table)}} - 
				<span class="up" data-relatedlevel="root"><i class="fa fa-home"></i></span>

				@if(isset($newnestedprimary['parents'][$key]) && isset($newnestedprimary['parents'][$newnestedprimary['parents'][$key]]) && isset($newnestedprimary['parents'][$newnestedprimary['parents'][$newnestedprimary['parents'][$key]]]) && isset($newnestedprimary['parents'][$newnestedprimary['parents'][$newnestedprimary['parents'][$newnestedprimary['parents'][$key]]]]) )
					<span class="up" data-relatedlevel="{{$newnestedprimary['parents'][$newnestedprimary['parents'][$newnestedprimary['parents'][$newnestedprimary['parents'][$key]]]]}}"><i class="fa fa-caret-right"></i>{{$newnestedprimary['titles'][$newnestedprimary['parents'][$newnestedprimary['parents'][$newnestedprimary['parents'][$newnestedprimary['parents'][$key]]]]]}}</span>
				@endif	

				@if(isset($newnestedprimary['parents'][$key]) && isset($newnestedprimary['parents'][$newnestedprimary['parents'][$key]]) && isset($newnestedprimary['parents'][$newnestedprimary['parents'][$newnestedprimary['parents'][$key]]]) )
					<span class="up" data-relatedlevel="{{$newnestedprimary['parents'][$newnestedprimary['parents'][$newnestedprimary['parents'][$key]]]}}"><i class="fa fa-caret-right"></i>{{$newnestedprimary['titles'][$newnestedprimary['parents'][$newnestedprimary['parents'][$newnestedprimary['parents'][$key]]]]}}</span>
				@endif	

				@if(isset($newnestedprimary['parents'][$key]) && isset($newnestedprimary['parents'][$newnestedprimary['parents'][$key]]))
					<span class="up" data-relatedlevel="{{$newnestedprimary['parents'][$newnestedprimary['parents'][$key]]}}"><i class="fa fa-caret-right"></i>{{$newnestedprimary['titles'][$newnestedprimary['parents'][$newnestedprimary['parents'][$key]]]}}</span>
				@endif	
			
				@if(isset($newnestedprimary['parents'][$key]))
					<span class="up" data-relatedlevel="{{$newnestedprimary['parents'][$key]}}"><i class="fa fa-caret-right"></i>{{$newnestedprimary['titles'][$newnestedprimary['parents'][$key]]}}</span>
				@endif
				
					<span><i class="fa fa-caret-right"></i>{{$newnestedprimary['titles'][$key]}}</span>
			</th>
		</tr>
		@if(count($table)==0)
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
			
			@foreach($table as $v)


				@if(is_object($v))
					<tr class="oddeven">
						<td><!--<span class='label'></span> -->{{$v->label}}</td>
						<td><a href="#" class="show_refs" data-type="{{$resultType}}" data-id="{{$oid}}" data-reftype="{{$type}}" data-refcat="{{$cat}}" data-refid="{{$v->id}}">Show reference{{count($v->incoming_references)>1?'s':''}} ({{count($v->incoming_references)}})</a></td>
						<td><a href="#details={{$v->id}}&rT=primary_sources&type=citing&refcat=&refid=" target="_blank" class="vscholar_lnk">VScholar</a></td>
						<td></td>
						<td></td>
						<td></td>
					</tr>
				@else
					<tr class="oddeven openable" data-relatedlevel="{{$v}}">
						<td><!--<span class='label'>ucfirst</span> -->{{$newnestedprimary['titles'][$v]}}<i class="fa fa-caret-right"></i></td>
						<td><a href="#" class="show_refs" data-type="{{$resultType}}" data-id="{{$oid}}" data-reftype="{{$type}}" data-refcat="{{$cat}}" data-refid="{{$v}}">Show reference{{$newnestedprimary['counts'][$v]>1?'s':''}} ({{$newnestedprimary['counts'][$v]}})</a></td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
					</tr>
				@endif
		
		
			@endforeach
			
			
			
		@endif
	</tbody>
@endforeach
