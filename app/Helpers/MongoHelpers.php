<?php // Code within app\Helpers\Helper.php

namespace App\Helpers;

use App\BibliodbJournal;

class MongoHelper
{
    public static function journalName($bid)
    {
		$j = BibliodbJournal::where('bid', $bid)->first();
        return $j->short_title;
    }
}