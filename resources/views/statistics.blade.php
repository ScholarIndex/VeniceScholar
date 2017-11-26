@extends('layout')

@section('content')












<div class="statzone">
<h4>Available in the database :</h4>
		<div class="col1">
			<div>
				<h5>Digitized content</h5>
				<ul>
					<li>{{number_format($stats['total_scans']->value)}} {{$stats['total_scans']->label}}</li>
					<li>{{number_format($stats['digitized_books']->value)}} {{$stats['digitized_books']->label}}</li>
					<li>{{number_format($stats['digitized_journals']->value)}} {{$stats['digitized_journals']->label}}</li>
					<li>{{number_format($stats['digitized_issues']->value)}} {{$stats['digitized_issues']->label}}</li>
					<li>{{number_format($stats['digitized_articles']->value)}} {{$stats['digitized_articles']->label}}</li>
					<li>{{number_format($stats['author_count']->value)}} {{$stats['author_count']->label}}</li>
				</ul>
			</div>
			<div>
				<h5>Annotations</h5>
				<ul>
					<li>{{number_format($stats['total_annotations']->value)}} {{$stats['total_annotations']->label}}</li>
					<li>{{number_format($stats['monographs_annotations']->value)}} {{$stats['monographs_annotations']->label}}</li>
					<li>{{number_format($stats['journals_annotations']->value)}} {{$stats['journals_annotations']->label}}</li>					
				</ul>
			</div>		
		</div>



		<div class="col2">
			<div>
				<h5>Extracted references</h5>
				<ul>
					<li>{{number_format($stats['total_references']->value)}} {{$stats['total_references']->label}}</li>
					<li>{{number_format($stats['ps_references']->value)}} {{$stats['ps_references']->label}}</li>
					<li>{{number_format($stats['ss_references']->value)}} {{$stats['ss_references']->label}}</li>					
				</ul>
			</div>
			<div>
				<h5>Citations</h5>
				<ul>
					<li>{{number_format($stats['cited_authors']->value)}} {{$stats['cited_authors']->label}}</li>
					<li>{{number_format($stats['cited_books']->value)}} {{$stats['cited_books']->label}}</li>
					<li>{{number_format($stats['cited_articles']->value)}} {{$stats['cited_articles']->label}}</li>
					<li>{{number_format($stats['cited_ps']->value)}} {{$stats['cited_ps']->label}}</li>					
				</ul>
			</div>		
		</div>

</div>

@endsection
