<?php

header('Access-Control-Allow-Origin: *');

header('Access-Control-Allow-Methods: GET, POST');

header("Access-Control-Allow-Headers: X-Requested-With");

if(file_exists('data.json'))  
{
    $current_data = file_get_contents('data.json');  
    $array_data = json_decode($current_data, true);  
    $extra = array(
        /* 'Title:' => $_POST['Title'], */
        
        'Creator: ' => $_POST['creator'],
        'Timestamp: ' => $_POST['timestamp'],
        'Note: ' => $_POST['inputText']     
        );
    $array_data[] = $extra;  
    $final_data = json_encode($array_data,JSON_PRETTY_PRINT);  
    echo $final_data;
    file_put_contents('data.json', $final_data);
    /* {  
        $message = "<label class='text-success'>Data has been stored in JSON format</p>";  
    }   */
}
?>
