<script>
	function OnRemoveOper(ev) {
		let attr = ev.target.attributes['email'];
		//   var evens = _.remove(users, function(n) {
		//     return n.email = attr.value;
		//   });
		console.log(users);
	}
</script>

<div on:click={OnRemoveOper} style="display: block;">
	<slot />
</div>
