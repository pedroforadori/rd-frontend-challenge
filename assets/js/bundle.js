(() => {
    const selector = selector => document.querySelector(selector);
    const create = element => document.createElement(element);
    const url = `http://www.mocky.io/v2/5dba690e3000008c00028eb6`
   
    const app = selector('#app');

    const login = create('div');
    login.classList.add('login');

    const Logo = create('img');
    Logo.src = './assets/images/logo.svg';
    Logo.classList.add('logo');

    const Form = create('form');
    Form.classList.add('login_form');

    Form.onsubmit = async e => {
        e.preventDefault();
        const [email, password] = e.target.parentElement.children;

        const url  = await fakeAuthenticate(email.value, password.value);
        
        location.href = '#users';
        
        const users = await getDevelopersList(url);
        debugger
        renderPageUsers(users);
    };

    Form.oninput = e => {
        var send = selector(".send");
        const [email, password, button] = e.target.parentElement.children;

        if (!email.validity.valid || !email.value || password.value.length <= 4) {
            button.setAttribute('disabled','disabled');
            send.style.background = "#c4c3c3";
        } else {
            button.removeAttribute('disabled');
            send.style.background = "#248524";
        }            
    };

    Form.innerHTML = 
        "<form>" +
        "<input type='email' placeholder='Entre com seu e-mail'/>" + 
        "<input type='password' class='pass' name='pass' minlength='5'" +
        "placeholder='Digite sua senha supersecreta' />" + 
        "<input type='submit' class='send' value='Entrar' />" + 
        "</form>";

    app.appendChild(Logo);
    
    app.appendChild(Form);

    const sendHover = selector(".send");

    sendHover.addEventListener("mouseover", e =>  {
        const [email, password, button] = e.target.parentElement.children;

        if (email.value != "" && password.value.length >= 5) {
            e.target.style.background = "#2ba32b";
        }
            
    });

    sendHover.addEventListener("mouseout", e =>  {
        const [email, password, button] = e.target.parentElement.children;

        if (email.value != "" && password.value.length >= 5) {
            e.target.style.background = "#248524";
        }
    });

    async function fakeAuthenticate(email, password) {
        var { url } = await getUrl();

        const fakeJwtToken = `${btoa(email+password)}.${btoa(url)}.${(new Date()).getTime()+300000}`;

        localStorage.setItem('token', fakeJwtToken)
       
        return url;
    }

    async function getUrl() {
        var link = fetch(`${url}`)
        .then(result => result.json())
        .then(url => url)

        return link;
    }

    async function getDevelopersList(url) {
        const data = fetch(url)
            .then(result => result.json())
            .then(users => users)

            return data;
    }

    function renderPageUsers(users) {
        app.classList.add('logged');
        Form.style.display = 'none';

        const Ul = create('ul');
        Ul.classList.add('container')

        users.forEach(e => {
            Ul.innerHTML += `
                <div class="card">
                    <img src="${e.avatar_url}" />
                    <span>${e.login}</span>
                </div>`
        });

        

        app.appendChild(Ul)
    }

    (async function(){
        const rawToken = localStorage.getItem('token')
        const token = rawToken ? rawToken.split('.') : null
        if (!token || token[2] < (new Date()).getTime()) {
            localStorage.removeItem('token');
            location.href = '#login';
            app.appendChild(Login);
        } else {
            location.href = '#users';
            const users = await getDevelopersList(atob(token[1]));
            renderPageUsers(users);
        }
    })()
})()