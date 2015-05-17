<?php

class Model {
	
	private $dbh;
	
	public function __construct($host,$user,$pass,$db)	{
		
		$this->dbh = new PDO("mysql:host=".$host.";dbname=".$db,$user,$pass);		
	}

	//search for a record
	public function searchModel($item){	

		$sth = $this->dbh->prepare("SELECT * FROM table_name WHERE ID=?");
		$sth->execute(array($item->ID));

		return json_encode($sth->fetchAll());
	}

	//get all records - implementation example
	public function getFees(){	
		
		$sth = $this->dbh->prepare("SELECT id,property_address,sale_date,settle_date,price,seller FROM fees");
		
		return json_encode($sth->fetchAll());
	}

	//insert a record
	public function add($model){		
		$sth = $this->dbh->prepare("INSERT INTO table(id) VALUES (?)");
		$sth->execute(array($model->ID));	
		
		if ($sth){ //let someone know
			mail("username@gmail.com","spc admin","added ".$model->ID);
		}

		return json_encode($this->dbh->lastInsertId());
	}
	
	//delete a record
	public function delete($model){	
		
		$sth = $this->dbh->prepare("DELETE FROM table WHERE ID=?");
		$sth->execute(array($model->ID));
		return json_encode(1);
	}
	
	//update a field
	public function updateValue($model){		
		$sth = $this->dbh->prepare("UPDATE table SET ". $model->field ."=? WHERE ID=?");
		$sth->execute(array($model->newvalue, $model->ID));
		if ($sth->error){ //let someone know
			mail("username@gmail.com","model.updateValue()",$sth->error);
		}	
		
		return json_encode(1);	
	}
}
?>