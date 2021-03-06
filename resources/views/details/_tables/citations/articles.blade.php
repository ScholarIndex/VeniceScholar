
	<tr><th colspan=5 class="h2 articles">{{ucfirst($cat)}} - {{count($lines)}}</th></tr>
	<tr>
		<th>Title <i class="fa fa-sort s-alpha"></i></th>
		<th><!-- show reference --></th>
		<th>Links</th>
		<th>Author <i class="fa fa-sort s-alpha"></i></th>
		<th>Journal <i class="fa fa-sort s-alpha"></i></th>
		<th>Year <i class="fa fa-sort s-num s-rev default"></i></th>
	</tr>

	<tbody class="lines articles">
	@if(count($lines)>0)
		@foreach($lines as $l)
			<tr>
				<td>{{$l->title}}</td>
				<td><a href="#" class="show_refs" data-type="{{$resultType}}" data-id="{{$oid}}" data-reftype="{{$type}}" data-refcat="{{$cat}}" data-refid="{{$l->id}}">Show reference{{count($l->incoming_references)>1?'s':''}} ({{count($l->incoming_references)}})</a></td>
				<td><a href="#details={{$l->id}}&rT=articles&type=references&refcat=&refid=" target="_blank" class="vscholar_lnk">VScholar</a> | <a href="http://{{ Config::get('vs.LBC_HOST') }}/article/overview/{{$l->id}}" target="_blank">Library</a></td>
                                <td>{{ is_array($l->author) && count($l->author)>0 ? str_limit($l->author[0]->name, $limit = 30, $end = '...') : '' }}</td>
				<td>{{MongoHelper::journalName($l->bid)}}</td>
				<td>{{$l->year}}</td>
			</tr>
		@endforeach
                @if(count($lines)>10)
                        <tr class="donthide"><td colspan="6">Show {{count($lines)-10}} more entries</td></tr>
                @endif
		
	@else
		<tr><td style="text-align:center" colspan="6">No citation found</td></tr>	
	@endif
		
	</tbody>
	
