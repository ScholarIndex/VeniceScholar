@include('details._headers.books')
<div class="searchreference">
	<input class="referenceinput" placeholder="Search in text of reference" />
</div>
<div class="detailslines">
	<table>
		<tr>
			<th>Text</th>
			<th>Links</th>
			<th>Typology</th>
			<th>Page</th>
		</tr>
		@foreach($o->cited as $type => $lines)
			@foreach($lines as $l)
				@foreach($l->incoming_references as $ir)
					<tr>
						<td>{{$ir->reference_string}}</td>
						<td>
							@if(isset($l->author[0]))
								<a href="#" class="vscholar_lnk" data-type="authors" data-cat="publications" data-id="{{$l->author[0]->id}}">Author</a>&nbsp;
							@endif
						
							@if($type == "articles")
								<a href="#" class="vscholar_lnk" data-type="articles" data-cat="references" data-id="{{$l->id}}">Source</a>
							@elseif($type == "books")
								<a href="#" class="vscholar_lnk" data-type="monographies" data-cat="references" data-id="{{$l->id}}">Source</a>
							@endif
						<td>{{ucfirst($type)}}</td>
						<td>{{$ir->start_img_number}}</td>
					</tr>
				@endforeach
			@endforeach
		@endforeach
	</table>	
</div>