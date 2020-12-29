<?php

require_once('./plum/plum_lightpad_functions.php');

$output = "";

// Headers
foreach (getallheaders() as $name => $value) {
  $output .= $name . ": " . $value . "\n";
}

// GET/POST values
//$output = "GET: " . print_r($_GET, TRUE) . "\n"; 
//$output .= "POST: " . print_r($_POST, TRUE) . "\n"; 
//$output .= "BODY: " . $payload ."\n";

// Get request content
$payload = stream_get_contents(getRequestBody());

try {
  $message = json_decode($payload, TRUE);
  $deviceMessageEncoded = $message["message"]["data"];
  $deviceMessageJson = base64_decode($deviceMessageEncoded);
  //$output .= "MESSAGE: " . print_r($message, TRUE) . "\n"; 
  //$output .= "DEVICE MESSAGE ENC: " . $deviceMessageEncoded . "\n"; 

  // Get real message object
  $deviceMessage = json_decode($deviceMessageJson, TRUE);
  $events = $deviceMessage["resourceUpdate"]["events"];
  $output .= "Event Message: " . "timestamp=" . $deviceMessage["timestamp"] .", id=" . $deviceMessage["eventId"] . "\n";
  foreach(array_keys($events) as $eventName){
    $output .= "Event: " . $eventName . "\n";
    $log = processEvent($eventName, $deviceMessage, $lightpad_config);
    $output .= "Processing Log: " . print_r($log, TRUE) . "\n";
  }
  $output .= "LIGHTPAD CONFIG: " . print_r($lightpad_config, TRUE);
  //$output .= "DEVICE MESSAGE: " . $deviceMessageJson . "\n"; 
  //$output .= "MESSAGE OBJ: " . print_r($deviceMessage, TRUE) . "\n";
  //$output .= "EVENTS: " . print_r($events, TRUE) . "\n";
} catch (Exception $e) {
  $output .= 'Caught exception: ' . $e->getMessage() . "\n";
}

// Log full request info
$fp = fopen('request.log', 'a');
fwrite($fp, "-------------------------------------------------------------------------------\n");
fwrite($fp, $output);
fclose($fp);

// Return response
header('Content-Type: application/json');
echo "{'processed-by': 'hal', 'status': 'OK', 'response': '".json_encode($output)."'}";

// ==============================================================================================
// Functions
// ==============================================================================================

/**
 * This is the method that invokes event triggers based on what kind
 * of event was received from the device(s).
 */
function processEvent($eventName, $eventObject, $lightpad_config) {

  global $result;
  $result = Array();

  if (stripos($eventName, "motion") !== false) {
    array_push($result, "Motion Detected!");
    // Motion trigger: turn on light
    //array_push($result, "calling turn_on_light");
    //turn_on_light($lightpad_config, $result);
    //array_push($result, "done calling turn_on_light");
  }

  if (stripos($eventName, "person") !== false) {
    array_push($result, "Person Detected!");
    // Person trigger
    // ...
  }

  if (stripos($eventName, "sound") !== false) {
    array_push($result, "Sound Detected!");
    // Sound trigger
    // ...
    //array_push($result, "calling turn_on_light");
    //turn_on_light($lightpad_config, $result);
    //array_push($result, "done calling turn_on_light");    
  }

  return $result;
}

/**
 * Turns on the Plim lightpad
 */
function turn_on_light($lightpad_config, $result) {
  array_push($result, "turn_on_light()");
	foreach($lightpad_config as $lightpad_id => $lightpad_data)
	{
		$lightpad_information = lightpad_information($lightpad_id);
		array_push($result, "Turning On Light: ".$lightpad_information['house_name']." - ".$lightpad_information['room_name']." - ".$lightpad_information['logical_load_name']);
		lightpad_on($lightpad_id);
	}
}

/**
 * Turns off the Plum lightpad
 */
function turn_off_light($lightpad_config, $result) {
	foreach($lightpad_config as $lightpad_id => $lightpad_data)
	{
        $lightpad_information = lightpad_information($lightpad_id); 
        echo "Turning Off Light: ".$lightpad_information['house_name']." - ".$lightpad_information['room_name']." - ".$lightpad_information['logical_load_name']."\n";
        lightpad_off($lightpad_id);
    }
}

/**
 * Returns the entire body of the current HTTP request
 */
function getRequestBody() {
  $rawInput = fopen('php://input', 'r');
  $tempStream = fopen('php://temp', 'r+');
  stream_copy_to_stream($rawInput, $tempStream);
  rewind($tempStream);
  return $tempStream;
}

?>