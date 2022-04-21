import "bootstrap/dist/css/bootstrap.min.css";

function component() {
  const element = document.createElement("div");

  // Lodash, currently included via a script, is required for this line to work
  element.innerHTML = `
	<h1 class="text-underline">Hello WEBpack!</h1>
	<form class="d-flex">
		<label>RSS Client</label>
		<input type="text" placeholder="Insert link to RSS">
		<button type="submit">Find</button>
	</form>
	`;

  return element;
}

document.body.appendChild(component());
