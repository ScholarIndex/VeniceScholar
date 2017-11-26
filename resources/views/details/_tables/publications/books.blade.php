@if(count($lines)>0)
	<tr><th colspan=5 class="h2 monographies">{{ucfirst($type)}} - {{count($lines)}}</th></tr>
	<tr>
		<th>Title <i class="fa fa-sort s-alpha"></i></th>
		<th>Links</th>
		<th>Publisher <i class="fa fa-sort s-alpha"></i></th>
		<th>Author <i class="fa fa-sort s-alpha"></i></th>
		<th>Year <i class="fa fa-sort s-num s-rev default"></i></th>
	</tr>
	<tbody class="lines">
		@foreach($lines as $l)
			<tr>
				<td>{{$l->title}}</td>
				<td><a href="#details={{$l->id}}&rT=monographies&type=references&refcat=&refid=" class="vscholar_lnk">VScholar</a> | <a href="http://{{ Config::get('vs.LBC_HOST') }}/document/overview/{{$l->bid}}">Catalog</a></td>
				<td>{{ str_limit($l->publisher, $limit = 30, $end = '...') }}</td>
				<td>{{ str_limit($l->author[0]->name, $limit = 30, $end = '...') }}</td>
				<td>{{$l->year}}</td>
			</tr>
		@endforeach
	</tbody>
@endif
