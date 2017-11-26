@include('details._headers.articles')
<div class="searchreference">
	<input class="referenceinput" placeholder="Search in text of reference" />
</div>
<div class="detailslines">
	<table>
		<tbody>
			<tr>
				<th>Text <i class="fa fa-sort s-alpha"></i></th>
				<th>Links</th>
				<th>Typology <i class="fa fa-sort s-alpha"></i></th>
				<th>Page <i class="fa fa-sort s-num"></i></th>
			</tr>
		</tbody>
		<tbody class"lines">
			@foreach($o->cited as $type => $lines)
				@foreach($lines as $l)
					@foreach($l->incoming_references as $ir)
						<tr>
							<td>{{$ir->reference_string}}</td>
							<td>
								@if(isset($l->author[0]))
									<a href="#details={{$l->author[0]->id}}&rT=authors&type=publications&refcat=&refid=" class="vscholar_lnk">Author</a>&nbsp;
								@endif

								@if($type == "articles")
									<a href="#details={{$l->id}}&rT=articles&type=references" class="vscholar_lnk">Source</a>
								@elseif($type == "books")
									<a href="#details={{$l->id}}&rT=monographies&type=references" class="vscholar_lnk">Source</a>
								@endif
							</td>
							<td>{{ucfirst($type)}}</td>
							<td>{{$ir->start_img_number}}</td>
						</tr>
					@endforeach
				@endforeach
			@endforeach
		</tbody>
	</table>
</div>
