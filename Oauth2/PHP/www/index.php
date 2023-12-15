<?php

error_reporting(E_ALL);
ini_set('log_errors', 1);

$debug = true;
if ($debug) {
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
}

// Including Composer
require __DIR__ . '/../vendor/autoload.php';

// Headers for CORS requests
header("Access-Control-Allow-Methods: *");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: X-Requested-With, Content-Type, Authorization");

$url = $_GET['_url'];

// Because .htaccess is dispatching a _url, we need to check if it's set
if (! isset($url)) {
    echo "Unspecified path";
    exit();
}

// Now, let's create the routing

// We firstly split the URL path by slashes
$url = array_filter(explode('/', $url));

$class_name = array_pop($url);

// Then we compose the name of the class and the path to the file
$root_to_class = implode("\\", array_map(function ($path) {
    // We pascalize the path, so from "path/to/file" we get "Path\To\File"
    // This is how namespaces work
    return pascalize($path);
}, $url));

// Composing the class name
$class = '\\' . ucwords($root_to_class) . '\\' . $class_name . '\\' . $class_name . 'Controller';

// Verifico se esiste la classe del controller altrimenti restituisco 404
if (!class_exists($class)) {
    if ($debug) {
        throw new \Exception("Missing controller's class {$class}");
    } else {
        http_response_code(404);
        exit;
    }
}


function pascalize($input, $separator = '_'): string
{
    return str_replace($separator, '', ucwords($input, $separator));
}