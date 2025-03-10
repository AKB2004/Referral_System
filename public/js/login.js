document.addEventListener("DOMContentLoaded", function ()
{
    const loginPage = document.querySelector(".Login");

    loginButton.addEventListener("click", function (event)
{
    event.preventDefault();

    const name = document.querySelector("input[placeholder='Enter your name']").value.trim();
    const email = document.querySelector("input[placeholder='Enter your email']").value.trim();
    const password = document.querySelector("input[placeholder='Enter the password']").value.trim();
    
    if (!name || !email || !password) {
        alert("Please fill in all fields!");
        return;
    }

    if (!validateEmail(email)) {
        alert("Invalid email format!");
        return;
    }

    fetch("/api/login",{
        method:"POST",
        headers: {"content-Type": "application/json"},
        body:JSON.stringify({name,email,password}),
    })
    .then(response => response.json())
    .then(data => {
        if(data.success)
        {
            window.location.href = "Dashboard.html";
        }
        else{
            alert(data.message);
        }
    })
    .catch(error => console.error("Error",error));

});
function validateEmail(email)
{
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

})