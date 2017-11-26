@if(count($lines)>0)
	<li><span>{{ucfirst($type)}} - {{count($lines)}}</span>
	<ul>
		@foreach($lines as $l)
			<li>
				<a href="#details={{$l->id}}&rT=monographies&type=references&refcat=&refid=" class="vscholar_lnk">
					{{ str_limit($l->title, $limit = 30, $end = '...') }}, {{ str_limit($l->publisher, $limit = 20, $end = '...') }}, {{$l->year}}
				</a>
			</li>
		@endforeach
	</ul>
	</li>
@endif
