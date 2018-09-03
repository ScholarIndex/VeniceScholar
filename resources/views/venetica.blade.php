@extends('layout')

@section('content')
<div class="cardView" id="wrapper">
<div class="search">
	<div class="filterZone authors">
		<span class="title">Filter by author<i class="fa fa-caret-down"></i></span>
		<div class="dropdown">
			<div><i class="fa fa-search"></i><input type="text" /></div>
			<ul class="rsList"></ul> 
			<ul class="letters">
				@for ($i = 0; $i < 26; $i++)
					<li class="{{chr(65+$i)}} active">{{chr(65+$i)}}</li>
				@endfor
			</ul>
		</div>
	</div>
	<div class="filterZone keywords">
		<span class="title">Filter by keyword<i class="fa fa-caret-down"></i></span>
		<div class="dropdown">
			<div><i class="fa fa-search"></i><input type="text" /></div>
			<ul class="rsList"></ul>
			<ul class="letters">
				@for ($i = 0; $i < 26; $i++)
					<li class="{{chr(65+$i)}} active">{{chr(65+$i)}}</li>
				@endfor
			</ul>			
		</div>		
	</div>
	<div class="sorts">
		<span class="list view">List view</span>
		<span class="card view">Card view</span>
	</div>
	<div class="disclaimer">DISCLAIMER: In this page we display a gallery of resources from <a href="http://europeana.eu/">Europeana</a> about the history of Venice. Results can be filtered according to a limited number of authors or keywords. This functionality is currently still experimental and was developed thanks to a Europeana Research Grant.</div>
</div>

<div class="filters">
<div class="head">Active filters:<br /><span>(0/10)</span></div>
<div class="tags"></div>

</div>
<div class="resultsHeaders">
	<table class="rs">
		<thead>
		<tr>
			<th class="thumb"></td>
			<th class="title">Title<i data-key="title" class="fa fa-sort"></i></td>
			<th class="provider">Provider<i data-key="provider" class="fa fa-sort"></i></td>
			<th class="year">Year<i data-key="year" class="fa fa-sort"></i></td>
			<th class="lang">Language<i data-key="lang" class="fa fa-sort"></i></td>
			<th class="licence">Licence<i data-key="licence" class="fa fa-sort"></i></th>
		</tr>
		</thead>
	</table>
</div>
<div class="results">
<p>Search for source about<br />Venice in Europeana</p>
	<table class="rs">
		<tbody>		
		</tbody>
	</table>

</div>
<p class="lazyMore"><span>Load more results</span><i class="fa fa-spinner fa-pulse veneticaspinner"></i></p>
</div>
@endsection
