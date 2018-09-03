@if(count($lines)>0)
	<tr><th colspan=5 class="h2 articles">{{ucfirst($type)}} - {{count($lines)}}</th></tr>
	<tr>
		<th>Title <i class="fa fa-sort s-alpha"></i></th>
		<th>Links</th>
		<th>Author <i class="fa fa-sort s-alpha"></i></th>
		<th>Journal <i class="fa fa-sort s-alpha"></i></th>
		<th>Year <i class="fa fa-sort s-num s-rev default"></i></th>
	</tr>
	<tbody class="lines articles">
		@foreach($lines as $l)
			<tr data-id="{{$l->id}}">
				<td>{{$l->title}}</td>
				<td><a href="#details={{$l->id}}&rT=articles&type=references&refcat=&refid=" class="vscholar_lnk" target="_blank" >VScholar</a> | <a href="http://{{ Config::get('vs.LBC_HOST') }}/article/overview/{{$l->id}}" target="_blank" >Library</a></td>
				<td>{{$l->author[0]->name}}</td>
				<td>{{MongoHelper::journalName($l->bid)}}</td>
				<td>{{$l->year}}</td>
			</tr>
		@endforeach
                @if(count($lines)>10)
                       <tr class="donthide"><td colspan="5">Show {{count($lines)-10}} more entries</td></tr>
                @endif
	</tbody>
	
@endif
