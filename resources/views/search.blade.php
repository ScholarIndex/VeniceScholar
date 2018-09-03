@extends('layout')

@section('content')

<div class="mainsearch">
	<div class="searchfield">
		<input class="searchinput" />
		<!--<i class="fa fa-caret-down"></i>
		<i class="fa fa-caret-right"></i>-->
	</div>
	<div class="suggestlist"></div>
	<!--<ul class="filters">
		<li class="chk {{isset($data['in']['contributions']) && $data['in']['contributions']=='false' ? '' : 'checked'}} contributions">Contributions</li>
		<li class="chk {{isset($data['in']['references']) && $data['in']['references']=='false' ? '' : 'checked'}} references">References</li>
	</ul>-->
	<div class="sample">
		<strong>Need some query tips? Here some things you can search for:</strong>
		<br /><br />
<ul>
<li>Patricia Fortini Brown (author)</li>
<li>Giustizia Vecchia (archival fund)</li>
<li>L’editoria veneziana nel ‘700 (monograph)</li>
<li>The “Tre Savii sopra l’Eresia” (journal article)</li>
</ul>
	</div>
	

	<div  class="advancedsearch">
		<a href="#" class="closebutton">×</a>
		<ul class="advfields">
			<li><span>with <strong>all</strong> words</span><input type="text" name="allwords" /></li>
			<li><span>with the <strong>exact phrase</strong></span><input type="text" name="exactphrase" /></li>
			<li><span>with <strong>at least one</strong> of the words</span><input type="text" name="atleastone" /></li>
			<li><span><strong>without</strong> the words</span><input type="text" name="without" /></li>
			<li><span>where my words occur</span><input type="text" name="occurs" /></li>
			<li><span>&nbsp;</span><i class="fa fa-check-square-o chkboxanywhere">anywhere in the title</i></li>
			<li><span><strong>authored by</strong></span><input type="text" name="authoredby" /></li>
			<li><span><strong>Return sources published by</strong></span><input type="text" name="publishedby" /></li>
			<li><span><strong>Return sources dated between</strong></span><input type="text" name="datedfrom" class="small" /> - <input type="text" name="datedto" class="small"/></li>

		</ul>
		
		<ul class="advfilters">
			<li class="chk {{isset($data['in']['books']) && $data['in']['books']=='false' ? '' : 'checked'}} books">books</li>
			<li class="chk {{isset($data['in']['contributions']) && $data['in']['contributions']=='false' ? '' : 'checked'}} contributions">Articles and contributions</li>
			<li class="chk {{isset($data['in']['primarysources']) && $data['in']['primarysources']=='false' ? '' : 'checked'}} primarysources">primary sources</li>
		</ul>
		<a href="#" class="searchbutton"><i class="fa fa-search"></i></a>
	</div>
</div>


@endsection
