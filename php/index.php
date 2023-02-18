<?php
$code = $_GET['code'];
$url = 'http://localhost:5000/request-token?code='.$code;
echo "
<script>
location.href='".$url."';
</script>
";
?>