<?php
function __autoload($className){
	include_once("../models/$className.php");	
}

$model=new Model("localhost","user","pass","db");

if(!isset($_POST['action'])) {
	print json_encode(0);
	return;
}

switch($_POST['action']) {
	case 'search_model':	

		$item = new stdClass;
		$item = json_decode($_POST['item']);
		print $model->searchModel($item);		
	break;

	case 'get_list':
		
		//$fees = new stdClass;
		//$fees = json_decode($_POST['fees']);
		print $model->getFees();
	break;
	
	case 'add_user':
		$model = new stdClass;
		$model = json_decode($_POST['model']);
		print $model->add($model);		
	break;
	
	case 'delete_model':
		$model = new stdClass;
		$model = json_decode($_POST['model']);
		print $model->delete($model);		
	break;
	
	case 'update_field_data':
		$model = new stdClass;
		$model = json_decode($_POST['model']);
		print $model->updateValue($model);				
	break;
}

exit();