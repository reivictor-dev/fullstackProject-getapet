
                       ~~~~~~> INICIO FRONT END <~~~~~~

começar com o npx create-react-app . para criarmos nossa aplicação frontend. 
Vamos criar o arquivo .env para utilizarmos coisas que vao ser utilizadas sempre que necessário e alem disso podemos colocar coisas que nao vá para nossa build, como senhas de dbs por exemplo.

Na estrutura do nosso projeto vamos limpar algumas coisas que nao vamos utilizar, coisa que vem como padrao do react. 
Vamos utilizar só o App.js, index.js e o index.css, do public vamos retirar tudo e deixar só o nosso html.
Dentro do nosso src vamos criar a pasta assets, que serve para arquivo estaticos. js, css, img e etc
Vamos ter tambem uma pasta chamada components, pasta para arquitetura do react que é baseada em componentes.
Context > no react temos um recurso chamado contexto onde podemos passar algumas variaveis para ela estar disponivel em algumas partes nossa aplicação, por exemplo, a autenticação do usuario, se tiver autenticado mostra uma coisa se nao tiver mostra outra. 
hooks > vamos ver na pratica.
utils > Parecida com o nosso helpers do backend

~~~~ React router dom ~~~~
versão 6 que é a atual.

Vamos começar importando nosso BrowserRouter como Router apenas, Routes e o Route. Para fazer as mudanças de pagina.
Podemos observar que a mudança pode acontecer quando colocamos nossas Route dentro do Switch que é sinaliza que vai ocorrer troca de pages. Assim devemos passar no nosso path as rotas que queremos que renderize tal componente. exemplo:
    <Route path="/register" element={<Register/> } />
Esse register vem do nosso components que foi importado!

~~~~ configurando navbar e footer ~~~~
Vamos criar nosso padrao de navbar e de footer para todas as paginas, isso lembrando bastando quando utilizavamos handlebars, o layout nunca mudava nas aplicações apenas o conteudo.

~~~~ CSS navbar e footer ~~~~
Vamos utilizar a tecnica do react chamada css modules, a gente vai criar um arquivo css no diretorio do nosso arquivo que vai ser estilizado. 
Fica muito parecido com a estilização do react native. 
a gente importa o arquivo css e usa o nome da estilização que demos no nosso arquivo css. Sendo assim utilizamos:> styles.navbar;

~~~~ Criando componente de container ~~~~
Componente estrutural;
Esse container vai envolver toda nossa estrutura a partir do Routes.
Ele vai ser criado na nossa pasta de components/layout e tambem tera um css para setarmos o seu tamanho minimo(min-height)
>>Podemos observar que mesmo que "abraçamos" as outras tags com o nosso component, ela deixou de exibir o que era exibido antes(home,register,login). Para resolver isso temos que passar como props o {children} dentro da nossa tag html dentro do container; Onde as tags filhas vao onde colocamos o children.

~~~~ Criando página de registro e form ~~~~
Vamos criar nosso form com diversos inputs dentro dele, mas como vamos utilizar inputs em varias partes da nossa aplicação vamos componentizar elas, criando um diretoio form dentro do components e criando o arquivo input com seu css. 
No nosso component de input vamos "importar" props que temos no nosso input, por exemplo, type, text, name, placeholder, handleOnChange, value, multiple esses serão os atributos que vamos receber(importar) no nosso component
Dai os valores que serão passados no nosso component quando utilizado quando importado, vai ser recebido no input e dai criara o input com o valor recebido; Isso é bom pois vamos aproveitar o mesmo component para criar varios inputs. 
Na pagina do register vamos criar nosso form passando os inputs.

~~~~ Estilos do Form ~~~~
Vamos criar dois module.css um para o Input que vamos importar dentro do input e outro para o form, onde vamos importar na nossa page de register.

~~~~ Criando Objeto de usuário ~~~~
No register, vamos começar criando um state para guardar o estado do user. 
Depois vamos setar o user dentro da nossa função handleChange(), vamos pegar todo os objeto utilizando o spread operator e depois setar pegando o nome de cada um dos inputs, por isso que colocamos o name em cada um dos campos, e passar como valor como o value, fica assim:
const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        })
    }
E vamos criar a função para pegar o submit e enviar um user para o banco;
Como queremos assim que criarmos o usuario já o autenticar no sistema, vamos ter que criar um hook que tera a possibilidade de logar, registrar e etc, e para isso vamos ter qeu criar um contexto, para comunicar a aplicação toda que o contexto do user muda ao fazer a autenticação ou ao fazer logout. Vamos começar do hook de autenticação e depois vamos para o contexto.

~~~~ Criando o hook de autenticação ~~~~
O hook vai fazer chamadas na api para tratar a autenticação.
Na pasta hook vamos criar o userAuth.js, dentro dele vamos importar os hooks, como o useState, useEffect, 
Para não ficarmos chamando toda hora a api e repetindo sempre os mesmos códigos, vamos criar na pasta utils um arquivo chamado api.js que vai padronizar isso.
e Para nao ficarmos toda hora precisamos "modificar" um pouco o axios por isso vamos exportar uma função do axios passando a baseurl, Ai no nosso useAuth vamos importa-lo;
Depois vamos criar dentro da nossa função useAuth() uma função registar(user) onde vamos receber o user e trata-lo, para fazer o registro. nesse caso vamos utilizar nossa rota que criamos no backend, fica assim:
            const data = await api.post('users/register', user).then((response) => {
                return response.data
            })

            console.log(data)
Veja que esperamos a resposta do nosso post e passamos o user que vamos pegar do nosso handleSubmit.
Depois vamos retornar essa função de register em um objeto desestruturado pois terao mais função para retornarmos. 

~~~~ Criando o contexto de usuario ~~~~
o contexto tem uma nomenclatura diferente, no nosso hooks a gente usa o useNomeDoHook ja no contexto vamos colocar o nome da entidade e depois vem o context, assim: UserContext.js
e o que ficar em baixo desse componente de context vai poder acessar o contexto dele, seja metodo, propriedade e etc. 
Dai vamos alimentar o context com o que vamos precisar. 
Vamos importar nosso hook nele, useAuth.js 
vamos criar o contexto criando uma const = createContext()
dai vamos criar uma função que vai prover o contexto as outros components, vamos criar a function userProvider({children}) o context tem que ter o children pois ele vai abraçar outros componentes, entao precisar saber o que ele vai ter q imprimir depois que abraçar todos os componentes, mas no sentido que para qual componente ele vai passar tal dado.
dai dentro dessa função vamos desestruturar nosso useAuth() pegando o register pois mais pra frente pode ser que utilizemos outras do useAuth
Depois vamos prover o contexto, passando um return:
    return (
        <Context.Provider value={register}>
            {children}
        <Context.Provider/>
    )
Nesse value vamos passar todas as nossas functions que estao disponivel nele, se agora o user puder acessar esse contexto pode acessar o metodo register. 
depois vamos exportar a função UserProvider e o Context e vamos importar o UserProvider no nosso App e abraçar todos os components que estão la a partir do Router;

~~~~ Executando rota da API no Formulario ~~~~
Vamos no nosso arquivo de resgistro(register) e executar a função que criamos no context. 
Vamos pegar nosso metodo register em destructuring do context e passar para um hook useContext(Context) passando nosso Context exportado como parametro.
Depois na nossa funçao de envio(handleSubmit) vamos passar o metodo register(user) passando o user,o objeto criado dentro dele. 
Depois que fizermos isso vamos iniciar nosso backend e vamos tentar fazer a o resgistro do user, podemos observar que se nao colocarmos nada nos campos vem um error 422 e vem a message que setamos no nosso backend, "nome é obrigatorio" e etc. a partir dai vamos criar nosso flash messages

~~~~ Criando HOOK de flash message ~~~~
Vamos começar criando o hook flash message na nossa pasta de hook. Dai vamos utilizar o module events, mais precisamente vamos utilizar o event bus, que é uma  tecnica entra os frameworks de frontend onde conseguem disparar eventos para components de maneira mais simples. 
PAra isso vmaos criar um novo utils, o bus, e importar nele o nosso EventEmitter e depois vamos exportar ele já instanciado para utilizarmos no nosso hook.
Dai no hook de flashmessage é só importarmos e dai vamos criar uma função principal e dentro dela vamos setar a mensagem em outra função. 
Nessa função vamos receber como parametro a msg eo type, e no escopo da função vamos passar o metodo bus.emit('flash', {
    message: msg,
    type: type
})
depoois só retornamos a função;

~~~~ Criando componente de mensagem ~~~~
Como ele faz parte do layout vamos inserir ele nesta pasta.

Vamos fazer um state do type e passar ele na className, pq dai dependendo de como o type vier, a mensagem sera alterada de acordo;
Dai vamos importar esse component no nosso app e coloca-la entre a navbar e o container, pois ela ira aparecer de acordo com a necessidade da aplicação erro ou sucesso;
Dai vamos estilizar criando 3 classes, a primeira para criar o "container" da mensagem e as outras duas de sucesso e error, e dai no type vamos setar qual vai ser renderizada.

~~~~ Finalizando componente de flash message ~~~~
Vamos começar criando uma constante para mostrar a mensagem quando ela deve aparecer, ou em sucesso ou em error. 
Essa constante é um state que vamos inicia-la como false, colcoando ela como um boolean.
Vamos passar essa variavel com um AND(&&) e o nosso codigo HTML, sendo assim a mensagem ja some. 
Vamos criar a mensagem dinamica tambem, ou seja, vamos criar ela com um state tambem. 
Depois vamos importar outro hook, que é o useEffect, vamos utilizar o useEffect pois ele permite que observe um evento uma vez só quando o componente é renderizado, se nao for useEffect o react vai fiacr mapeando a vizualição desse evento constantemente o que vai gerar um load infinito no nosso component, ele observa as mudanças q estao acontecendo na aplicação, ele começa aver se precisa renderizar esse component dnv, esse nao, esse sim e etc, entao se nao for useEffect isso vai ficar sendo executada milhares de vezes, para conter as execuções de algo.
Entao o que vamos observar com nosso useEffect? 
Vamos passar o bus dentro dele, passando um addListener para mapear um evento, e depois vamos fazer algo se baseando neste evento.
Entao no nosso listener vamos setar a visibility, a message, e o type. Com o respesctivos valores(true, message e type) que recebemos do nosso parametro. 
E tambem nesse listener vamos passar um setTimeout para tirar a mensagem em 3secs, só colocamos a setVisibility para false novamente. 
Agora temos qeu ter esse evento disparado na nossa autenticação, vamos primeiro criar um let de text e de type passando o texto de sucesso e o type success(igual colocamos no nosso css). Depois vamos mudar os valores desses dois no nosso catch para caso de error. e por fim mandar essas variaveis na nossa funççao setFlashMessage(msgText,msgType)

~~~~Autenticando usuario cadastrado~~~~
Quando um user for registrado vamos salva-lo na nossa localstorage, o token no caso.
Vamos criar uma função que vai trabalhar como helper, pois vamos utiliza-la tbm no nosso login, só qeu vamos cria-la no nosso useAuth.js. 
Vamos criar tambem um novo state para mandar se o user ta autenticado ou nao, vamos colocar o valor inicial de false, entao ele nunca esta autenticado. Dai quando cairmos na nossa função authUser, nós vamos trocar esse state para true e vamos salvar o token no localstorage, nesse token qeu vem da nossa requisição.  localStorage.setItem('token', JSON.stringify(data.token)) data vem da nossa requisição, e por fim dar um navigate para outra rota, a rota '/'.
Depois de criada vamos jogar essa função criada no nosso try que faz req com a api. 
Vamos exportar a variavel authenticated e vamos utiliza-la no nosso context.
Vamos inserir o token automaticamente quando o nosso user acessar alguma pagina, para isso vamo usar o useEffect. passando na Authorization do Header o nosso Bearer Token. E tambem setando o nosso autheticated para true. 
Para mostrar ao usuario que nao esta logado os links para logar, vamos utilizar o nosso authenticated criando uma condicional ternaria se o authenticated for true faz isso se nao mostra o entrar e cadastrar.
-> Deslogar: Para deslogar o usuario vamos criar uma funcao no nosso useAuth para que ao usuario clicar em algum link ou algo assim, ele deslogue.
-> Logar: Criamos o form de login utilizando nossa componentização do Input que criamos anteriormente que deu uma padronização e produtividade. Agora vamos fazer a lógica do login:>
Vamos começar ela no nosso useAuth que vamos exportar a função de login que sera criada. Vamos passar nosso padrao de mensagens ja passando a mensagem de sucesso. msgText e msgType. depois no 1catch vamos passar a mensagem de error. 
Depois vamos passar um post na api receber do nosso parametro a senha e o email(user). d
Vamos passar nossa funcao de login para o context e depois conseguimos utiliza-la na nossa funcao de login. Na funcao login do login.js vamos utilizar state, e mudar o user dentro do handleChange que vai pegar o objeto user e vai mudar chave e valor com o é recebido do target de acordo com o que o usuario digita.
Depois vamos criar um handleSubmit e passar dentro do onSubmit do form. passando nosso login(user) onde o user vem dos inputs preenchidos.

~~~~> Criando pagina de perfil <~~~~
Criamos um componente Profile e passamos no nosso App.js ele para a rota user/profile, depois colocamos no navbar um link para esta rota. 
Depois de criado, vamos preencher os campos com os dados do usuario que esta logado. Para isso vamos ter que usar o token do usuario que vai ser resgatado do localStorage onde armazenamos ele. Dai dentro do useEffect vamos chamar a api com um get para checar se tem usuario passando a rota. Se tiver usuario vai salvar na variavel token como objeto e a partir dai vamos utilizar ela nos campos.
~>Atualizando os users, vamos utilizar a estrategia do spread operator que vai pegar a chave e o valor de cada campo digitado. para os nosso onFileChange vamos alterar só o target do valor, passando o .files[0]; 
No nosso handleSubmit começamos setando a msgtype como success, depois instanciamos um formData que cria um novo form que vai ser utilizado na nossa chamada da api, onde sera passado no body da chamada. só que antes disso vamos traduzir:
    await Object.keys(user).forEach((key) =>
            formData.append(key, user[key])
        )
Para cada key(chave) do objeto user, vamos adicionar a chave e o user.chave  feito isso, jogamos ele no body da chamada.


~~~~ Atualização de imagem do usuario ~~~~
Vamos primeiro renderizar a imagem se ela existir criando um state de preview, ou seja, se existir imagem vamos mostrar se nao nao. E se o usuario editar a imagem sera salva. com uma url exemplo: blob:http://localhost:3000/1158c9b4-781b-4a48-9836-6c9009e48c11
Agora vmaos só ajustar o tamnho da imagem, padroniza-la. Vamos criar um component para isso onde passaremos nele como props nosso className, src e o alt que vamos passar lá onde setamos a imagem(profile).

~~~~ Criando a pagina de lista de PETS ~~~~
vamos criar uma pasta Pet na PAGES para dar inicio, e criar um arquivo MyPets.js e tambem vamos criar esse link na navbar.
Depois estilizar utilizando o css, e tambem fazer os imports necessarios para trabalharmos com a adição. 
Importante ressaltar que vamos utilizar o form como component pois vai ser reaproveitado em outra rota(page) de editar pet.
Para começar a lógica vamos pegar os valores dos inputs de file e de text, e tambem o do nosso Select. Para isso vamos utilizar as funções handle passando cada tipo, no do file vamos dar um spread no nosso pet, e chamar a chave de image e o valor ser os arquivos que serao carregados, importante frezar que aqui por serem varias imagens vamos fazer um spread.
No de text, vamos fazer parecido, só que como temos mais de um valor a ser assumido, vamos passar como um array de chave e valor, com o name do input e o target.value de cada um.
No Select, vamos passar o spread de pet assim como os outros, o nome da chave color e pra acessar o valor das options do select vamos fazer o seguinte: e.target.options onde conseguimos todas as opções do select e pegamos a opção selecionada e pegamnos o texto dela passando a propriedade .text
Vamos ter tambem um onSubmit no form que vamos criar uma lógica para o submit, que vai parar o evento(e.preventDefault()) e vai disparar o evento que veio no submit. O evento vai vir por props e vamos passar o nosso objeto pet.

Agora vamos fazer o preview das images, onde quando o usuario selecionar as fotos que ele quer colocar vai aparecer na tela. Para isso vamos começar colocar uma div e adicionar uma lógica nela, assim:
                {preview.length > 0
                    ? preview.map((image, index) => (
                        src={URL.createObjectURL(image)}
                            alt={pet.name}
                            key={`${pet.name}+${index}`} />
                    )) :
                    pet.images && pet.images.map((image, index) => (
                        src={`${process.env.REACT_APP_API}/images/pets/${image}`}
                            alt={pet.name}
                            key={`${pet.name}+${index}`} />
                    ))
                }
Onde se o preview for maior que 0, vamos mostrar as imagens que o usuario colocou. Se for menor, ou seja, nao existir imagens de para renderizar um preview, vamos mostrar as proprias imagens que vem do pet e fazer um map se tiver mais que uma.
Na nossa primeira lógica, vamos criar uma url para a image, passar a alt, e tambem a key. Na segunda lógica, vamos pegar a imagem pela url que foi criada.
obs: Quando tentamos passar o nosso preview sem transforma-lo em array ele vem como fileList, e com isso nao conseguimos utiliza-lo, entao para transforma-lo em array, vamos no nosso handleOnFileChange criar um array desse fileList utilizando o metodo Array.from(e.target.files).

~~~~~Vamos trabalhar na adição de pets ~~~~

No nosso addPet vamos criar uma função assincrona para fazer requisições a api. Dai essa função vai ser passada no nosso petForm que passa nosso metodo pro filho(a função submit do petForm) que vai executar a função
Para começar ja vamos presetar a a msgtype como success, tambem vamos criar nosso formData parecido com o que a gente fez no user. Só que agora vamos passar uma condicional, o código fica:
        await Object.keys(pet).forEach((key) => {
            if (key === 'images') {
                for (let i = 0; i < pet[key].length; i++) {
                    formData.append('images', pet[key][i])
                }
            } else {
                formData.append(key, pet[key])
            }
        })
Onde vamos passar por cada chave do nosso objeto pet e vamos fazer o seguinte:> se nao for images vamos dar o formData.append passando a chave(nome, peso, cor etc) e valor vai ser o pet com a chave(nome, peso, cor etc) para ser feito dinamicamente chave e valor.
Se a key for images vamos iterar sobre todas as imagens passando cada uma das imagens nesse nosso 'images' com o pet[chave][indice];


~~~~REquisição para pegar todos os pets cadastrados ~~~~
Vamos na nossa page MyPets e utilizar o useEffect para assim q o usuario entrar na pagina uma vez já disparar o a api pra pegar todos os pets. lembrando q no useEffect precisamos passar uma dependencia, nesse caso passamos o token, pois ja estamos utilizando ele.
Podemos observar que os pets chegam pela requisição da aplicação.  Inspecionar elemento/network.
Agora vamos adicionar os pets na nossa tela.

-> Exibindo pets na dashboard
Vamos fazer um map quando o pets.length for maior que ZERO, passando uma div com a key do pet._id e passando nossa roundedImage com as configs.
<div key={pet._id}>
                            <RoundedImage
                                src={`${process.env.REACT_APP_API}/images/pets/${pet.images[0]}`}
                                alt={pet.name}
                                width="75px"

                            />
                            <span className='bold'>{pet.name}</span>
                            <div className={styles.action}>
                                {pet.available ? (
                                    (<>
                                        {pet.adopter && (
                                            <p>Concluir adocao</p>
                                        )}
                                        <Link to={`/pet/edit/${pet._id}`}>Editar</Link>
                                        <button>Excluir</button>
                                    </>)
                                )
                                    :
                                    (
                                        <p>Pet já adotado</p>
                                    )}
                            </div>
                        </div>
Na div action verificamos se o pet esta disponivel com um condição ternaria. Se tiver disponivel vamos criar um fragment passando se o atributo adopter do pet for true mostra "Concluir adocao" se nao, nao.

-> Removendo pet: Vamos criar uma função async para remover o pet do sistema passando como parametro o ID, depois vamos chamar a api fazendo ela executar a função .delete e a rota de delete do nosso backend. DAi no nosso then() vamos excluir tambem o pet do nosso frontend assim que o click ocorrer. Passando o um .filter no pets pegando todos os pets menos o pet que a gente excluiu(id do pet excluido), Depois vamos chamar a função no button de remover, passando ela como função anonima para esperar nosso click e nao executar a função assim que o react renderizar a pagina.

-> Editando Pets: Vamos criar um form que já vai vir com os atributos do pet a ser editado, para isso vamos criar uma nova page passando a rota de edit que criamos no backend. a rota recebe um id que sera do pet a ser editado.
Para pegar os parametros da rota, vamos utilizar um metodo do react router dom que é o useParams. e dai vamos pegar o parametro da rota baseado no nome que colocamos no nosso parametro, por exemplo, neste caso a rota vem dinamina com o parametro ID entao quando formor criar a variavel para pegar esse parametro utilizando useParams vamos utilizar o nome que utilizamos na rota como nome da varivel, neste caso ID.
Agora vamos utilizar o useEffect para que assim que entrar na pagina ele já realizar a seguinte lógica: Vamos fazer um get com o id do pet a ser editado
Lembrando que no useEffect passamos as dependencias para o useEffect, neste caso vao ser TOKEN e ID(Começamos com elas num valor fixo e utilizamos ela como recurso)
Depois só criarmos uma condicional de exibição para exibirmos o pet se tiver pet.nome, entao vamos renderizar o petForm com as informaççoes do pet.
Depois vamos criar a função updatePet e fazer a lógica identica ao do addpet porem mudamos a requisição e a rota no nosso api.

~~~~ Exibindo os pets na home ~~~~
Vamos pegar todos os pets atraves da rota /pets e passar todos os pets para nosso state que esta como array, que sera preenchido como pets.

~~~~Detalhes do pet individual ~~~~
Vamos pegar a função petDetails e passar para ela alguns variaveis que vamos utilizar, vamos buscar os pets pelo params e mostrar os detalhes dele.
|