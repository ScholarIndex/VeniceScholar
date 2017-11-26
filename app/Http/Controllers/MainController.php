<?php

namespace App\Http\Controllers;
use View;
use Validator;
use Input;
use Redirect;
use Auth;
use Hash;
use Log;
use App\User;
use Mail;
use Session;
use Cache;
use App\Document;
use App\Metadata;
use App\Page;
use App\BibliodbAuthor;
use App\BibliodbArticle;
use App\BibliodbJournal;
use App\BibliodbAsve;
use App\BibliodbBook;
use App\Disambiguation;
use App\Reference;
use App\VSHistory;
use bheller\ImagesGenerator\ImagesGeneratorProvider;
use Illuminate\Http\Request;

define('ROOT',  config('vs.JSROOT'));
define('LRBB',  ROOT.'bibliodb_books');
define('LRBA',  ROOT.'bibliodb_articles');
define('LRBC',  ROOT.'bibliodb_contributions');
define('LRBH',  ROOT.'bibliodb_authors');
define('LRBV',  ROOT.'bibliodb_asve');
define('LRR',   ROOT.'references');
define('API_PORT', config('vs.API_PORT'));
define('API_ROOT', config('vs.API_ROOT').API_PORT);
define('SOLR_CORE', config('vs.SOLR_CORE'));

class MainController extends Controller
{
		private $solrconnection = null;


		public function api_call($qry){
			$url = API_ROOT.$qry;
			\Log::error($url);
		    $headers = get_headers($url);
			$code = substr($headers[0], 9, 3);
			if($code < 400){
				return json_decode(file_get_contents($url));
			}else{
				return false;
			}
		}

        public function welcome()
        {
            return View::make('welcome', []);
        }

        public function results()
        {
            return View::make('results', ['hasTopMenu' => 'hasTopMenu', 'dataJs' => 'SEARCH', 'data' => Session::get('lastQuery', [])]);
        }


		public function search()
		{
			Session::forget('lastQuery');
			return $this->lastSearch();
		}

		public function error($code){
			return View::make('errors.'.$code);
		}

		public function lastSearch()
		{
			
			return View::make('search', ['noHeadSearch' => true, 'hasTopMenu' => 'hasTopMenu', 'dataJs' => 'SEARCH', 'data' => Session::get('lastQuery', [])]);
		}

		public function about()
		{
			return View::make('about');
		}
	


		public function statistics()
		{
			$data = ['hasTopMenu' => 'hasTopMenu', 'dataJs' => ''];

			$data['stats'] = [];
			if( ! $st = $this->api_call('/api/stats')){
				abort(500);
			}	

			foreach($st->stats as $s){
				$data['stats'][$s->id] = $s;
			}

	
			return View::make('statistics', $data);
		
		}

		public function logaction(Request $request){
			$a = new VSHistory;
			foreach($request['params'] as $k => $v)
				$a[$k] = json_encode($v);

			$a['user'] = Auth::user()->id;
			$a->save();
			die();			
			


		}	


		public function connectSolr(){
	
			if($this->solrconnection == null){
				define('SOLR_SERVER_HOSTNAME', 'dhlabsrv5.epfl.ch');
				define('SOLR_SECURE', true);
				define('SOLR_PATH', SOLR_CORE);
				define('SOLR_SERVER_PORT', 8983);
				define('SOLR_SERVER_USERNAME', '');
				define('SOLR_SERVER_PASSWORD', '');
				define('SOLR_SERVER_TIMEOUT', 10);
	
				$options = array
				(
					'path' => SOLR_PATH,
					'hostname' => SOLR_SERVER_HOSTNAME,
					'login'    => SOLR_SERVER_USERNAME,
					'password' => SOLR_SERVER_PASSWORD,
					'port'     => SOLR_SERVER_PORT
				);
				$this->solrconnection = new \SolrClient($options);
			}	
		}
	
		public function searchCount(Request $request){
			$q = $request->q;
			$filtrs = $request->filtrs;

			
			if($q == ""){
				 $qry = "document_id:0"; // TO force SORL to return all field in ns facetting but 0 results
			}else{
				$fields = array(
					LRBB => array('title', 'publisher', 'author'),
					LRBA => array('journal_short_title', 'title', 'first_author'),
					LRBC => array(),
					LRBH => array('author_final_form'),
					LRBV => array('label'),
					LRR => array('reference_string')		
				);
				$ORs = array();
				foreach($fields as $ns => $flds){
					if(count($flds)){
						$fORs = array();
						foreach($flds as $f)
							$fORs[] = $f.":(".$q.")";	
						
						$ORs[] = "( ns:".$ns." AND (".implode(' OR ', $fORs).") )";
					}
				}
				$qry = implode(' OR ', $ORs);
	
				if(count($filtrs)>0){
					foreach($filtrs as $field => $keys){
						switch($field){
							case 'year':
								$qry = "(".$qry.")" . " AND (year:[".$keys['mindate']." TO ".$keys['maxdate']."])";
								break;
							default:
								$cond = [];
								foreach($keys as $k){
									$cond[] = $field.":(".$k.")";
								}
								$qry = "(".$qry.")" . " AND (".implode(' OR ', $cond).")";
								break;
						}
					}	
				}

	
	
			}

			$this->connectSolr();
			$query = new \SolrQuery;
			$query->setQuery($qry);
			$query->setRows(0);
			$query->setFacet(true);
			$query->addFacetField('ns');
			$query_response = $this->solrconnection->query($query);
			$response = $query_response->getResponse();

			return json_encode(array('response' => $response));
		}


	
		public function yearChart(Request $request){
			$q = $request->q;
			$filtrs = $request->filtrs;

			if($q == ""){
				 $qry = "document_id:0"; // TO force SORL to return all field in ns facetting but 0 results
			}else{
				$fields = array(
					LRBB => array('title', 'publisher', 'author'),
					LRBA => array('journal_short_title', 'title', 'first_author'),
					LRBC => array(),
					LRBH => array('author_final_form'),
					LRBV => array('label'),
					LRR => array('reference_string')		
				);
				$ORs = array();
				foreach($fields as $ns => $flds){
					if(count($flds)){
						$fORs = array();
						foreach($flds as $f)
							$fORs[] = $f.":(".$q."*)";	
						
						$ORs[] = "( ns:".$ns." AND (".implode(' OR ', $fORs).") )";
					}
				}
				$qry = implode(' OR ', $ORs);
			}
			$this->connectSolr();
			$query = new \SolrQuery;
			$query->setQuery($qry);
			$query->setRows(0);
			$query->setFacet(true);
			$query->addFacetField('year');
			$query->setFacetSort(\SolrQuery::FACET_SORT_INDEX);
			$query->setFacetMinCount(1);
			$query->setFacetLimit(-1);
			$query_response = $this->solrconnection->query($query);
			$response = $query_response->getResponse();

			$rs = (array)$response->facet_counts->facet_fields->year;

			if( count($rs) == 0)
				return json_encode([]);

			$results = [];	
			
			foreach($rs as $y => $v)
				$results[$y] = $v;
			$allYears = array_keys($results);
			

			$data = [];
			$data['minYear'] = min($allYears);
			$data['maxYear'] = max($allYears);
			$data['minVal'] = min($results);
			$data['maxVal'] = max($results);
			$data['selectedMin'] = isset($filtrs['year']['mindate']) ? $filtrs['year']['mindate'] : min($allYears);
			$data['selectedMax'] = isset($filtrs['year']['maxdate']) ? $filtrs['year']['maxdate'] : max($allYears);
			$data['values'] = [];
			

			for($y = $data['minYear']; $y <= $data['maxYear']; $y++)
				$data['values'][$y] = isset($results[$y]) ? $results[$y] : 0;

			$data['val'] = array_values($data['values']);
			$data['orig'] = $response->facet_counts->facet_fields->year;
			return json_encode($data);
		}


		public function filters(Request $request){
			

			$q = $request->q;
			$field = $request->field;
			$filtrs = $request->filtrs;

			if($q == ""){
				 $qry = "document_id:0"; // TO force SORL to return all field in ns facetting but 0 results
			}else{
				$fields = array(
					LRBB => array('title', 'publisher', 'author'),
					LRBA => array('journal_short_title', 'title', 'first_author'),
					LRBC => array(),
					LRBH => array('author_final_form'),
					LRBV => array('label'),
					LRR => array('reference_string')		
				);
				$ORs = array();
				foreach($fields as $ns => $flds){
					if(count($flds)){
						$fORs = array();
						foreach($flds as $f)
							$fORs[] = $f.":(".$q."*)";	
						
						$ORs[] = "( ns:".$ns." AND (".implode(' OR ', $fORs).") )";
					}
				}
				$qry = implode(' OR ', $ORs);
			}
			$this->connectSolr();
			$query = new \SolrQuery;
			$query->setQuery($qry);
			$query->setRows(0);
			$query->setFacet(true);
			$query->addFacetField($field);
			$query->setFacetSort(\SolrQuery::FACET_SORT_COUNT);
			//$query->setFacetMinCount(2);
			$query->setFacetLimit(10);
			$query_response = $this->solrconnection->query($query);
			$response = $query_response->getResponse();


	
			return View::make('filters', array('field' => $field,'filtrs' => $filtrs, 'response' => $response->facet_counts->facet_fields->{$field}));

		}



		public function details(Request $request, $resultType){

			switch($resultType){
				case 'authors':
					$id = $request->id;
					$cat = $request->type;
					if( ! $o = $this->api_call('/api/authors/'.$id)){
						abort(404);
					}
					
					$cdC = 0;
					$cgC = 0;
					$pC = 0;
					foreach($o->cited as $type => $lines) $cdC += count($lines);
					foreach($o->citing as $type => $lines) $cgC += count($lines);
					foreach($o->publications as $type => $lines) $pC += count($lines);
					$data = array(
						'o' => $o,
						'oid' => $o->author->id,
						'resultType' => $resultType,
						'publicationsCount' => $pC,
						'citedCount' => $cdC,
						'citingCount' => $cgC,
						'type' => $cat,
						'cnt' => 1,
					);
		
					if($cat == 'publications'){
						return View::make('details.authors.publications' ,$data);
					}else{
						$data['nestedprimary'] = $this->nestedPrimary($o->{$cat});
						return View::make('details.authors.citations' ,$data);
					}
					break;

				case 'monographies':
					$id = $request->id;
					$cat = $request->type;
					if( ! $o = $this->api_call('/api/books/'.$id)){
						abort(404);
					}
					$cdC = 0;
					$cgC = 0;
					$rC = 0;
					foreach($o->cited as $type => $lines) $cdC += count($lines);
					foreach($o->citing as $type => $lines) $cgC += count($lines);
					foreach($o->cited as $type => $lines)
						foreach($lines as $l)
							$rC += count($l->incoming_references);
					$data = array(
						'o' => $o,
						'oid' => $o->book->id,
						'resultType' => $resultType,
						'referencesCount' => $rC,
						'citedCount' => $cdC,
						'citingCount' => $cgC,
						'type' => $cat
					);

					if($cat == 'references'){
						return View::make('details.monographies.references' ,$data);
					}else{
						$data['nestedprimary'] = $this->nestedPrimary($o->{$cat});
						return View::make('details.monographies.citations' ,$data);
					}

					break;

				case 'articles':
					$id = $request->id;
					$cat = $request->type;
					if( ! $o = $this->api_call('/api/articles/'.$id)){
						abort(404);
					}
					$cdC = 0;
					$cgC = 0;
					$rC = 0;
					foreach($o->cited as $type => $lines) $cdC += count($lines);
					foreach($o->citing as $type => $lines) $cgC += count($lines);
					foreach($o->cited as $type => $lines)
						foreach($lines as $l)
							$rC += count($l->incoming_references);
					$data = array(
						'o' => $o,
						'oid' => $o->article->id,
						'resultType' => $resultType,
						'referencesCount' => $rC,
						'citedCount' => $cdC,
						'citingCount' => $cgC,
						'type' => $cat
					);


					if($cat == 'references'){
						return View::make('details.articles.references' ,$data);
					}else{
						$data['nestedprimary'] = $this->nestedPrimary($o->{$cat});
						return View::make('details.articles.citations' ,$data);
					}


					break;

				case 'primary_sources':
					$id = $request->id;
					$cat = $request->type;
					if( ! $o = $this->api_call('/api/primary_sources/asve/'.$id)){
						abort(404);
					}
					$cgC = 0;
					foreach($o->citing as $type => $lines) $cgC += count($lines);
					$data = array(
						'o' => $o,
						'oid' => $o->primary_source->id,
						'resultType' => $resultType,
						'citingCount' => $cgC,
						'type' => $cat
					);


					$data['nestedprimary'] = $this->nestedPrimary($o->citing);
					return View::make('details.primary_sources.citations' ,$data);

					break;


			}	
		}

		public function nestedPrimary($citations){

			$archives = array(
				"Archivio di Stato di Venezia" => "asve"
			);

			$tabs = [];
			$tabs['ps'] = [];
			$tabs['root'] = [];
			if(isset($citations->primary_sources)){
			foreach($citations->primary_sources as $o){
				if( ! isset($tabs['root'][$o->archive])) $tabs['root'][$o->archive] = 0;
				$tabs['root'][$o->archive] += count($o->incoming_references);


				if(!isset($tabs[$o->archive])) $tabs[$o->archive] = [];

				if( ! $ps = $this->api_call('/api/primary_sources/'.$archives[$o->archive].'/'.$o->id)){
					continue;
				}
				
				if(count($ps->primary_source->hierarchy) == 1){
					$tabs[$o->archive][] = $o;
				}else{

					$first = true;
					for($i = count($ps->primary_source->hierarchy)-2; $i >= 0; $i--){

						if($first) {
							$tabs[$ps->primary_source->hierarchy[$i]->id][] = $o;
							$tabs['ps'][$ps->primary_source->hierarchy[$i]->id] = $this->api_call('/api/primary_sources/'.$archives[$o->archive].'/'.$ps->primary_source->hierarchy[$i]->id)->primary_source;
							$first = false;
						}
						if($i == 0){	
							if( ! isset($tabs[$o->archive][$ps->primary_source->hierarchy[$i]->id])) $tabs[$o->archive][$ps->primary_source->hierarchy[$i]->id] = 0;
							$tabs[$o->archive][$ps->primary_source->hierarchy[$i]->id] += count($o->incoming_references);
						}
						if( $i != 0 && $first != true){
							
							if( ! isset($tabs[$ps->primary_source->hierarchy[$i-1]->id])) $tabs[$ps->primary_source->hierarchy[$i-1]->id] = [];
							if( ! isset($tabs[$ps->primary_source->hierarchy[$i-1]->id][$ps->primary_source->hierarchy[$i]->id])) $tabs[$ps->primary_source->hierarchy[$i-1]->id][$ps->primary_source->hierarchy[$i]->id] = 0;
							$tabs['ps'][$ps->primary_source->hierarchy[$i-1]->id] = $this->api_call('/api/primary_sources/'.$archives[$o->archive].'/'.$ps->primary_source->hierarchy[$i-1]->id)->primary_source;

							$tabs[$ps->primary_source->hierarchy[$i-1]->id][$ps->primary_source->hierarchy[$i]->id] += count($o->incoming_references);
						}
							
					}





				}


			}
			}
			foreach($tabs as $k => $arr){
				krsort($tabs[$k]);
			}

			return $tabs;
		}


		public function smalldetails(Request $request, $resultType){

			switch($resultType){
				case 'authors':
					$id = $request->id;
					$cat = $request->type;
					if( ! $o = $this->api_call('/api/authors/'.$id)){
						abort(404);
					}
					$cdC = 0;
					$cgC = 0;
					$pC = 0;
					foreach($o->cited as $type => $lines) $cdC += count($lines);
					foreach($o->citing as $type => $lines) $cgC += count($lines);
					foreach($o->publications as $type => $lines) $pC += count($lines);
					$data = array(
						'o' => $o,
						'oid' => $o->author->id,
						'resultType' => $resultType,
						'publicationsCount' => $pC,
						'citedCount' => $cdC,
						'citingCount' => $cgC,
						'type' => $cat,
						'cnt' => 1,
					);
		
					return View::make('smalldetails.authors' ,$data);
					break;
			}	
		}

		public function refs(Request $request){
			$references = array();
			$rT = ($request->resultType == 'monographies') ? 'books' : $request->resultType;

			if($o = $this->api_call('/api/'.$rT.'/'.($rT=='primary_sources'?'asve/':'').$request->oid)){
	
				foreach($o->{$request->reftype}->{$request->refcat} as $refgroup){
					if($request->refcat=='primary_sources'){
						foreach($refgroup->hierarchy as $h){
							if($request->refid == "Archivio di Stato di Venezia" || $h->id == $request->refid){
								$references = array_merge($references, $refgroup->incoming_references);
							}else{
	
							}
						}
					}else{
						if($refgroup->id == $request->refid){
							$references = array_merge($references, $refgroup->incoming_references);
						}
					}
				}

			}

			return View::make('details.references', array('references' => $references));
		}


		public function authorPublicationCSV($aid){
			header("Content-Type: text/plain");
			$output = "";

			if($o = $this->api_call('/api/authors/'.$aid)){
				
				$heights = [];
				
				$output .= '"title","type","journal","year","height"';
				$output .= "\n";
				foreach($o->publications as $type => $items){
					foreach($items as $i){
						if($i->year > 0){
							if(isset($heights[$i->year])) $heights[$i->year]++; else $heights[$i->year] = 0;
							if(isset($i->journal_short_title)) $journal = "in «".$i->journal_short_title."»"; else $journal = "";
							$output .= '"'.str_replace('"','""',$i->title).'","'.str_replace('"','""',$type).'","'.$journal.'","'.str_replace('"','""',$i->year).'","'.str_replace('"','""',$heights[$i->year]).'"';
							$output .= "\n";
						}
					}
				}
			}
			die($output);
		}



		public function citationsCSV($resultType, $type, $mid){
			header("Content-Type: text/plain");
			
			switch($resultType){
				case 'monographies': $api = 'books'; break;
				case 'articles': $api = 'articles'; break;
				case 'authors': $api = 'authors'; break;
				case 'primary_sources': $api = 'primary_sources/asve'; break;
			}

			$output = '"start","end","citing","cited","citing_h","cited_h"';
			$output .= "\n";

			if($o = $this->api_call('/api/'.$api.'/'.$mid)){
			
	
				$counts = [];
				$p = new \stdClass;
				$p->citing = 0;
				$p->cited = 0;
				if(isset($o->citing)){
				foreach($o->citing as $type => $items){
					foreach($items as $i){
						if(isset($i->year) && $i->year > 0){
							if(	 ! isset($counts[(int)$i->year])){
								$counts[(int)$i->year] = clone $p;
							}						
							$counts[(int)$i->year]->citing++;
						}		
					}
				}
				}
				if(isset($o->cited)){
					foreach($o->cited as $type => $items){
						foreach($items as $i){
							if(isset($i->year) && $i->year > 0){
								if(	 ! isset($counts[(int)$i->year])){
									$counts[(int)$i->year] = clone $p;
								}						
								$counts[(int)$i->year]->cited++;
							}
						}
					}
				}
				if(count($counts)>0){
				$startYear = min(array_keys($counts));
				$hasUnder1500 = ($startYear < 1500);
				if($hasUnder1500){
					$realStartYear = $startYear;
					$startYear = 1500;
				}
				$endYear = max(array_keys($counts));
				$roundedStartYear = floor($startYear/10)*10;
				$roundedEndYear = ceil($endYear/10)*10;
				$nbRoundedYear = $roundedEndYear - $roundedStartYear + 1;
	
				if($nbRoundedYear <= 15){
					$nbGroupedYears = 1;
				}elseif($nbRoundedYear <= 150){
					$nbGroupedYears = 10;
				}elseif($nbRoundedYear <= 300){
					$nbGroupedYears = 20;
				}elseif($nbRoundedYear <= 750){
					$nbGroupedYears = 50;
				}else{	
					$nbGroupedYears = 100;
				}
	
				$nbGroups = $nbRoundedYear / $nbGroupedYears;
	
				$groups = [];
				if($hasUnder1500)
				{
					$m = new \stdClass;
					$m->start = $realStartYear;
					$m->end = 1499;
					$m->cited = 0;
					$m->citing = 0;
					$groups[] = $m;
				}
				for($i = 0; $i <$nbGroups; $i++){
					$m = new \stdClass;
					$m->start = $roundedStartYear + $i * $nbGroupedYears;
					$m->end = $roundedStartYear + ($i+1) * $nbGroupedYears - 1;
					$m->cited = 0;
					$m->citing = 0;
					if($m->start <= date('Y'))
						$groups[] = $m;
				}
	
	
				foreach($counts as $year => $o){
					foreach($groups  as $g){
						if($year >= $g->start && $year<=$g->end){
							$g->cited += $o->cited;
							$g->citing += $o->citing;
							break;
						}
					}
				}
	
	
				}
	
	

				if(isset($groups)){
	
					$max = 0;
					foreach($groups as $g){
						$max = max($max, $g->citing, $g->cited);
					}
	
		
					foreach($groups as $g){
						$citing_h = ($g->citing==0) ? 0 : 5 + floor(($g->citing/$max)*95);
						$cited_h = ($g->cited==0) ? 0 : 5 + floor(($g->cited/$max)*95);
						$output .= $g->start.",".$g->end.",".$g->citing.",".$g->cited.",".$citing_h.",".$cited_h."\n";
					}
				}
			}
			die($output);
		}



		public function searchPost(Request $request){
				
		
			$q = $request->q;
			if($q == "")
				die();

			$ns = $request->ns;
			$p = $request->p;
			$filtrs = $request->filtrs;
//			$in = $request->in;

			Session::put('lastQuery', ['q' => $q, 'ns' => $ns, 'p' => $p/*, 'in' => $in*/]);

			$this->connectSolr();

			$fields = array(
				LRBB => array('title', 'publisher', 'author'),
				LRBA => array('journal_short_title', 'title', 'first_author'),
				LRBC => array('_id'),
				LRBH => array('author_final_form'),
				LRBV => array('label'),
				LRR => array('reference_string')		
			);

			$nsCat = array(
				ROOT."bibliodb_contributions" => "contributions",		
				ROOT."bibliodb_articles" => "articles",
				ROOT."bibliodb_asve" => "primary_sources",
				ROOT."bibliodb_authors" => "authors",
				ROOT."bibliodb_books" => "monographies",
				ROOT."references" => "references"
			);
			

			$cat = array( 
				32 => LRR,
				16 => LRBV,
				8 => LRBC,
				4 => LRBA,
				2 => LRBB,
				1 => LRBH
			);

			$ORs = array();
			foreach($cat as $k => $n){
				if($ns >= $k){
					$ns -= $k;
					if(count($fields[$n])){
						$fORs = array();
						foreach($fields[$n] as $f)
							$fORs[] = $f.":(".$q.")";	
						
						$ORs[] = "( ns:".$n." AND (".implode(' OR ', $fORs).") )";
					}
					
				}
			}

			$qry = implode(' OR ', $ORs);

			if(count($filtrs)>0){
				foreach($filtrs as $field => $keys){
					switch($field){
						case 'year':
							$qry = "(".$qry.")" . " AND (year:[".$keys['mindate']." TO ".$keys['maxdate']."])";
							break;
						default:
							$cond = [];
							foreach($keys as $k){
								$cond[] = $field.":(".$k.")";
							}
							$qry = "(".$qry.")" . " AND (".implode(' OR ', $cond).")";
							break;
					}
				}	
			}

			
			$offset = ($p-1)*10;
			$query = new \SolrQuery;
			$query->setQuery($qry);
			$query->setStart($offset);
			$query->setRows(10);
			$query->addField('_id');
			$query->addField('ns');
			$query->addField('score');
			$query_response = $this->solrconnection->query($query);
			$response = $query_response->getResponse();
			$results = array();
			$i = $offset+1;
			//echo "<!--".print_r($response,1).'-->';
			if(is_array($response->response->docs)){
				foreach($response->response->docs as $doc){
	
					$cited = 0;
					$citing = 0;
					$citingRatio = false;
					$title = "";
					$subtitle = "";
					$citationData = "";
					$occurrences = "";
					$recordOK = false;
					switch($doc->ns){
						case LRBH : 

							if(! $obj = $this->api_call('/api/authors/'.$doc->_id)){
								continue;
							}
							foreach($obj->cited as $type => $citations) $cited+=count($citations);
							foreach($obj->citing as $type => $citations) $citing+=count($citations);
							$title = $obj->author->name." <a href='#' class='shortdetails'>View short details</a>";
							$citationData = 'data-cited="'.$cited.'" data-citing="'.$citing.'"';
							$citingRatio = true;
							$occurrences = isset($obj->occurrences) ? $obj->occurrences : "";		
							$recordOK = true;	
							break;
	
						case LRBB : 
							if(!$obj = $this->api_call('/api/books/'.$doc->_id)){continue;}
							foreach($obj->cited as $type => $citations) $cited+=count($citations);
							foreach($obj->citing as $type => $citations) $citing+=count($citations);
							$title = (isset($obj->book->author[0])?$obj->book->author[0]->name." - ":"").$obj->book->title;
							$subtitle = $obj->book->place.": ".$obj->book->publisher.", ".$obj->book->year;
							$citationData = 'data-cited="'.$cited.'" data-citing="'.$citing.'"';
							$citingRatio = true;
							$occurrences = isset($obj->occurrences) ? $obj->occurrences : "";
							$recordOK = true;	
							break;
	
						case LRBA : 
							if(!$obj = $this->api_call('/api/articles/'.$doc->_id)){continue;}
							foreach($obj->cited as $type => $citations) $cited+=count($citations);
							foreach($obj->citing as $type => $citations) $citing+=count($citations);
							$title = (isset($obj->article->author[0])?$obj->article->author[0]->name." - ":"").$obj->article->title;
							$subtitle = $obj->article->year;
							
							$citationData = 'data-cited="'.$cited.'" data-citing="'.$citing.'"';
							$citingRatio = true;
							$occurrences = isset($obj->occurrences) ? $obj->occurrences : "";
							$recordOK = true;	
							break;
						case LRR : 
							if(!$obj = $this->api_call('/api/references/'.$doc->_id)){continue;}

							switch($obj->containing_document_type){
								case 'article':
									if(!$parent = $this->api_call('/api/articles/'.$obj->containing_document_id)){continue;}
									$uri ="http://lbc_dev.archives.world/article/viewer/".$obj->containing_document_id."#".$obj->start_img_number;
									$title = str_limit($obj->reference_string, $limit = 130, $end = '...')." <a href='".$uri."' target='_blank'><i class='fa fa-link'></i></a>";
									$subtitle = (isset($parent->article->author[0])?$parent->article->author[0]->name." - ":"").$parent->article->title.", ".$parent->article->year." p. ".$obj->start_img_number;
									break;
	
								case 'book':
									if(!$parent = $this->api_call('/api/books/'.$obj->containing_document_id)){continue;}
									$uri = "http://lbc_dev.archives.world/document/viewer/".$obj->bid."#".$obj->start_img_number;
									$title = str_limit($obj->reference_string, $limit = 130, $end = '...')." <a href='".$uri."' target='_blank'><i class='fa fa-link'></i></a>";
									$subtitle = (isset($parent->book->author[0])?$parent->book->author[0]->name." - ":"").$parent->book->title.", ".$parent->book->year;
									break;
								case null:
									$title = str_limit($obj->reference_string, $limit = 130, $end = '...');
									$subtitle = "[Unreferenced containing document]";

									break;
							}

							
							$subtitle = "<span class='".$obj->containing_document_type."' data-id='".$obj->containing_document_id."'>".$subtitle."</span>";
							$recordOK = true;	
							break;
	
						case LRBV : 
							if(!$obj = $this->api_call('/api/primary_sources/asve/'.$doc->_id)){continue;}
							
							$title = "Archive of Venice, ".$obj->primary_source->internal_id;
							$subtitle = $obj->primary_source->label;							
							$occurrences = isset($obj->occurrences) ? $obj->occurrences : "";
							$recordOK = true;	
							break;
					}

	
					if($recordOK){
						echo '<div data-id="'.$doc->_id.'" class="result '.$nsCat[$doc->ns].' notGraphed" '.$citationData.' title="[ '.$i++.' ] '.$doc->_id.'">'; 
							echo '<p class="title">'.$title.'</p>';
							echo '<p class="subtitle">'.$subtitle.'</p>';
							if($citingRatio && $citing+$cited>0){
								echo '<div class="graph"></div>';
								echo '<ul>';
									if($occurrences != "")
										echo '<li>Found occurences in DB: '.$occurrences.'</li>';
									echo '<li>Citing: '.$citing.'</li>';
									echo '<li>Cited by: '.$cited.'</li>';
								echo '</ul>';
							}
						echo '</div>';
					}



				}
			}
		}




}
