<?php

namespace App;

use Jenssegers\Mongodb\Model as Eloquent;


class VSHistory extends Elegant {
   
	protected $collection = 'vs_history';

	public $timestamps = true;

}
