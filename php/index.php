<?php
$code = $_GET['code'];
$url = 'http://localhost:3000/request-token?code='.$code;
echo "
<script>
location.href='".$url."';
</script>
";
?>