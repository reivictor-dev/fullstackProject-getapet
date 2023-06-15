~~~~> PROJETO <~~~~

                        ~~> BACK END <~~
~~~~ Estruturando o projeto ~~~~
Começamos fazendo a estrutura de pastas do nosso backend e a instalação dos pacotes necessarios. 
controllers / models / routes / helpers / db / public

db > conexao do banco de dados, lembrando que com node v18 utilizamos 127.0.0.1 no lugar do localhost!
helpers > funcões que vao nos ajudar de diversas maneiras e varias partes da aplicação, nao tem lugar fixo. Por exemplo, uma funçao de tratar o token
public > Vamos utiliza-la para manter as imagens dos pets e dos users
Sobre o cors: 
~~~~> O CORS (Cross-origin Resource Sharing) é um mecanismo usado para adicionar cabeçalhos HTTP que informam aos navegadores para permitir que uma aplicação Web seja executada em uma origem e acesse recursos de outra origem diferente. Esse tipo de ação é chamada de requisição cross-origin HTTP.

Nessa aplicação nao vamos precisar do nosso url.enconded porque queremos nos comunicar atraves de JSON mesmo.

OBS: Nos routes nao vamos precisar termos uma rota '/' pq como vai ser uma api a gente vai poder dizer que a rota '/' é uma rota especifica la do front, e podemos trabalhar direto com as rotas users e pets.

Nosso frontend vai ficar na porta 3000 e o backend na porta 5000

~~~~ Criando models ~~~~

Vamos os models e a conexão com o db.
Criar os models User e Pets
Podemos notar que a image tambem é do tipo String pois que vamos receber é o caminho da imagem e nao o arquivo em si!
timestamps ele cria duas colunas novas(campos novos), createdAt e updateAt. é muito importante!

No model Pets observamos coisas diferente e muito importante. Quando formos usar multiplas imagens, a gente passa um conjunto(Array)!!!
Agora para fazer uma "relação" vamos criar o usuario, passando ele como objeto assim como o nosso adopter. Que mais a frente faremos a lógica para eles, utilizando o nosso User model.

~~~~ Criando controller e Rotas do User ~~~~
Vamos criar os arquivos no controller e na routes. Depois importar no index com o nome UserRoutes passando ele como rota '/users'
Criamos no routes a userRoutes para chamarmos o nossas rotas relacionada aos users, primeiramente criamos a rota register. E no controller criamos a logica para testa no nosso postman.

~~~~ Validação do Usuario ~~~~

Vamos apagar nossa res de teste no controller e criar a lógica para registrar o usuario de fato!

Nas validações é de extrema importancia lembrar que precisamos passar o status na nossa logica. 
lembrando que nunca passamos a senha que o user digitou, sempre cryptografamos ela antes de ir para o db.
Vamos criar uma função na pasta helpers, a função que vamos criar, sera utilizada não só no nosso register, mas tambem no login, por isso esta sendo criado nos helpers.

É nessa funçao que vamos fazer a lógica do TOKEN, onde vamos importar o JWT, e utilizar o metodo sign({}) passando o id e o name, é interessante pois depois podemos decodificar o token e pegar os dados que passamos.
e depois do objeto passando isto, vamos passar nosso secret. 

depois vamos importar no controller e utilizar onde criamos nosso newUser e passando essa funçao criada utilizando como parametro nosso newUser, req, res. As requisiçoes e respostas começaram no controller e terminaram nessa nossa nova função.
Perceba que recebemos um token e com isso ja podemos autenticas o usuario

~~~~ Login ~~~~
Vamos criar nossa rota de login com post! E criar nossa lógica no controller pegando o email e password do body e passando noossas validaçoes.
Precisamos garantir que o usuario existe.
Precisamos garantir que a senha fornecida pelo usuario no login bate com a senha do db. Para isso vamos utilizar o compare do bcrypt passando a senha do que o useria digitou no login e a senha que existe no db.

depois de passar pelas validações, autenticamos o user utilizando nossa função criada no helpers. Passandoo user.

~~~~ Verificando o usuario pelo token ~~~~
Vamos criar uma variavel currentUser sem valor, apenas de controle e depois fazer uma req.headers.authorization para validar o token, se existir token, faz algo se nao o currentUser fica igual null.
Afim de testarmos o que estamos recebendo vamos passar o console.log(req.headers.authorization), quando passamos o nosso token lá no header, recebemos Bearer dasdasduihbewuhifjdso90u219348t8fd/*(token) 
é dessa maneira que vamos verificar se o usuario esta logado ou nao no sistema. 

~~~~ Pegando token do header ~~~~
Vamos criar um helper para isso, pois vamos utilizar essa função em varios lugares do codigo!
Nessa funcao vamos pegar o authorization e vamos tirar o Bearer que vem junto quando solicitamos. Para isso vamos utilizar o split(' ')[1], onde é criado um array e vamos pegar a segunda parte dele([1])

vamos jogar nosso token no if(req.headers.authorization) onde vamos passar nosso helper criado que recebe como parametro a requisição(req) e retorna nosso token. Depois vamos decodificar ele, transformando-o de uma token para um objeto(o usuario completo), e com isso podemos pegar o id do usuario! 
Como o usuario completo é retornado devemos tirar o password dele por questoes de segurança!! 
Agora que temos o user, logado no nosso header, podemos selecionar as partes do objeto dele que desejarmos, por exemplo, para mostrar o nome dele logado!

~~~~ Resgatando usuario por ID ~~~~
Vamos criar a rota dinamica para pegar o usuario pelo ID, vamos pegar o usuario pelo model User.findById(id) esse id que foi passado veio do req.params.id, criamos uma condicional para se o usuario nao existir, a gente retorna que o usuario nao existe! 
se existir, mostramos o usuario em json!
Só que mostra tambem a password e nao queremos isso... Entao vamos retirar. 
basta passar no nosso findById(id).select('-password'), aqui retirar o atributo que nao requeremos que ele traga.

~~~~ Verificação do token do usuario ~~~~
Vamos fazer a rota de atualização(PATCH), vamos fazer essa rota protegida, vai ter qeu ter uma verificação de token(middleware) antes do user acessar ela!

/******PUT ou PATCH?
Escolha o PUT se o que você pretende é fazer uma atualização completa do seu recurso ou o PATCH se você quiser atualizar apenas um subconjunto dos dados do seu recurso. ******/

vamos criar um novo helper, o verifyToken para passar como middleware e verificar se tem algum token no header. Vamos utilizar o nosso outro helper o getToken(req) e verificar se foi passado algum token!!
Só qeu temos que validar antes se existe algo no authorization para prosseguirmos com a logica. 
dentro de um trycatch vamos fazer a verificação usando o metodo verify do jwt, fica assim:
try {

        const verified = jwt.verify(token, 'nossosecret')
        req.user = verified
        next()

    } catch (error) {
        return res.status(400).json({ message: 'Token inválido!' })

    }

~~~~ Validações de atualizações de usuario ~~~~
Vamos fazer as validações agora no nosso update!
Vamos fazer igual fizemos no nosso register, só vamos acrescentar para ver se o email ja esta cadastrado. Achando o usuario pelo email e depois condicionando-o ao email cadastrado que seja diferente do email passado e do email achado na db. E vamos atribuir o email passado para atualizar para o email que ja existe no user.email. 

Antes fizemos uma validação pelo ID, porem é perigoso pois outro usuario pode fazer modificaçoes se outro usuario utilizar o ID de outro para modificar. Entao baseado nisso, vamos fazer as checagem pelo TOKEN do usuario! 
assim: 
const getUserByToken = async (token) => {

    const decoded = jwt.verify(token, 'nossosecret')

    const userId = decoded.id

    const user = await User.findOne({ _id: userId })

    return user
}

Onde decoficamos o token para criar uma variavel onde possamos pegar o id do usuario qeu foi decodificado! E com isso achar um unico usuario pelo id dele decodificado! e por fim retornamos ele!

~~~~ Upload de imagem do user ~~~~
Vamos criar agora um helper para que o user possa fazer upload de suas imagens. Isso é feito com o pacote do Multer.
Vamos passar o metodo do multer.diskStorage({
    destination:
    filename:
})
na nossa destination vamos direcionar a pasta em que as fotos vao ser salvas, para isso precisamos identificar a url qeu veio essa requisição, se foi da USER ou da PETS, pois dai faremos a escolha da folder para salvar cada uma em suas pastas.
if (req.baseUrl.includes('users')) {
            folder = "users"
        } else if (req.baseUrl.includes('pets')) {
            folder = "pets"
        }
Depos disso na mesma função vamos utilizar o nosso cb passando null como primeiro argumento e como segundo a nossa url dinamica, assim:
cb(null, `public/image/${folder}`) perceba que a url vai mudar quando baseada na url tiver recebendo os valores que foram condicionados. 
Depois em outro metodo do nosso multer.diskStorage, o filename: cb(null, Date.now() + path.extname(file.originalname)) aqui vamos setar o nome do arquivo que vamos receber do user, pegando a data em milisec e o nome depois do . ~~> Exemplo .jpg e etc
Agora vamos fazer o nosso imageUpload depois que setamos nosso storage. 

const imageUpload = multer({
    storage: imageStorage,
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg)$/)) {
            return cb(new Error("Por favor, enviar apenas jgp ou png!"))
        }
        cb(undefined, true)
    }
})

Aqui vamos passar o local do storage no primeiro atributo e no segundo vamos filtrar para saber se o arquivo que estamos recebendo esta no tipo de arquivos que queremos. nesse caso jpg/png.

Agora só criarmos nossa rota para a recepção das imagens pelo user. 
vamos utilizar nossa rota de patch, a rota de edição. Passando o nosso arquivo importado.
imageUpload.single("image")
Aqui estamos passando o metodo single, que significa que vamos receber uma unica imagem e o campo que vai ser enviado no formulario se chama "image", entao como é um middleware, ele vai esperar isso, se vier ele faz o upload.
Agora precisamos salvar o nome da imagem no DB. 
Vamos fazer isso no controller. Os arquivos vem por requisição no req.file, sabendo disso vamos utilizar uma condicional:
if (req.file) {
            user.image = req.file.filename
        }
Aqui se houver arquivo(file), no db vamos passar o user.image com o nome nosso filename que criamos no nosso helper! 
Para enviar essas imagens no nosso postman vamos utilizar a parte de form-data, onde podemos colocar de text para file e passar o arquivo referente a key que estamos querendo, nesse caso image.

~~~~Vamos começar a rota PETS~~~~
Vamos deixar tudo engatilhado para trabalharmos depois na logica, vamos criar os arquivos que vamos precisar, importar o que precisamos no nosso index e etc.

~~~~~Salvando PET no sistema~~~~
Vamos precisar de middleware, como o que ja criamos, o verifyToken, para salvar no sistema apenas usuarios autenticados.
Vamo fazer as validações necessarias em cada campo solicitado.
E depois criar um objeto com o esse pet que vai ser criado baseado no que recebemos do body
Mas antes de criarmos nosso objeto vamos precisar pegar o dono do pet, entao para isso vamos precisar de 2 dos nossos helpers o getToken que vamos usar para pegar o token do user, e o getUserByToken que vai servir para decodificar o token no usuario. e a partir dai utilizar seus atributos.
Depois vamos salvar esse pet(o objeto que criamos) dentro de um trycatch passando o metodo pet.save() e utilizando o catch caso de algum erro.

~~~~ Upload de multiplas imagens ~~~~
Nós vamos utilizar nosso middleware ja criado que é o imageUpload e passar outro método para receber multiplas imagens que é o metodo array; 
imageUpload.array('image') passando como parametro nosso diretorio de onde estao as images. 
Vamos receber a imagem do req.file e fazer a validação sobre ela, da mesma forma que fizemos com os outros atributos só qeu agora passando o length para verificar se o array esta vazio.
Como a images é um array, vamos percorrer esse array com o map e colocar apenas o nome nas images.
Atentar para quando for mais de um arquivo(file) devemos colocar files e nao apenas file na requisição. 
Como vamos colocar varios arquivos juntos, as vezes pode dar erro no name, podendo vir na mesma hora e consequentemente com o mesmo nome, por isso vamos adicionar mais uma variavel no nome para modificar ele. 
o String(Math.floor(Math.random() * 1000)) assim passamos uma string com numero aleatorio ate 1000. 

~~~~ Resgatando todos os Pets ~~~~

vamos criar uma rota home, rota padrao para os pets '/'
Depois no controller quando formos fazer nossa logica, vamos pegar todos os pets e mostrar os pets mais novos inseridos.

const pets = await Pet.find().sort('-createdAt')

Aqui criamos uma variavel para pegar todos os pets e utilizamos o metodo sort passando como parametos o createdAt, importante ressaltar que quando tem o sinal " - " antes quer dizer que vamos colocar na ordem crescente. 

~~~~Pets do usuario logado~~~~

Aqui vamos criar a rota, passando o middleware que verifica se esta logado, e depois passando a função de pegar todos os pets daquele user
No controller vamos criar nossa lógica, muito parecida com o nosos getAll, apenas vamos passar um filtro no .find('user._id': user._id) passando assim que vamos filtrar pelo id do usuario que esta solicitado.

~~~~Resgatar todas as doações~~~~
Vamso começar criando essa rota. 
No nosso controller, vamos deixar tudo parecido com a rota anterior, só que agora nao vamos buscar por user._id vamos colocar um atributo que vamos inserir posteriormente que é o de adopter._id, e partir dele vamos achar os pets que foram adotados por aquele user.id.

~~~~Resgatando o pet pelo Id~~~~
Aqui vamos ter a funcionalidade de ver o pet no sistema, para solicitar a visita.
Vamos criar a rota para acessar os detalhes de cada um. 
No nosso controller, vamos pegar o id do usuario pelo req.params e depois vamos verificar se o id é válido. Para isso temos um helper do mongoose que é o ObjectId, dai conseguimos checar, assim:
        if (!ObjectId.isValidObjectId(id)) {
            res.status(422).json({ message: "ID inválido!" })
            return
        }

Depois vamos pegar o pet passando o metodo findOne({_id: id}) e vamos fazer uma ultima validação se o pet nao for encontrado. 
Por fim enviamos o pet.

~~~~Removendo Pet do Sistema~~~~
Vamos criar uma rota dinamica com DELETE.
No controller vamos fazer a verificação se o ID existe, 
Vamos verificar se o usuario conectado é o usuario qeu quer remover o pet
        if (pet.user._id.toString() !== user._id.toString()) {
            res.status(422).json({ message: "Houve um problema em processar a sua solicitação, tente mais tarde!" })

        }

Após essa verificação vamos remover o pet com sucesso.

~~~~Update do PET~~~~
Vamos criar a rota de update, lembrando que o update pode passar imagens, entao vamos colocar nosso middleware de imagem alem do nosso de verificar se estao logado.
Vamos pegar os atributos qeu vem do body, vamos pegar o id do params e vamos criar uma variavel updatedData que vai ser um objeto qeu vamos ir salvando as atualizações que vao ser feitas durante o processo.
Agora vamos fazer as validações parecida com nosso remove.
verificar se o ID existe, o pet, se o pet.user._id é o mesmo do user._id, fazer as validações do campos que vamos receber do body(podemos copiar do create) só que agora vamos adicionar um else na nossa validação, passando o nosso updatedData.atributo = atributo assim mantendo oqeu veio do req.
Por fim passamos o metodo findByIdAndUpdate(id, updatedData) e passamos como parametro o id e a nossa variavel updatedData! 

~~~~Agendando visitação do PET~~~~
Marcar uma visita com quem esta adotando o pet. 
O user que quer adotar vai clicar num btn que vai gerar um evento(isso no front) que vai agendar uma visita, dai vamos obter os dados da pessoa que esta adotando. 
Vamos criar uma rota dinamica para isso. 
No nosso controller pegar o id pelo params, e vamos fazer as validações, a primeira é verificar se o pet existe. 
Depois vamos verificar se a user que quer adotar é o mesmo que é o dono do pet. 
Vamos verificar se o user ja agendou uma visita. 
depois das validações vamos atualizar o pet.adopter e passar no nosso Pet.findByIdAndUpdate(id, pet);
OBS: Metodo equals verifica se determinada dado é igual ao outro.

~~~~Concluindo a adoção do PET~~~~
Vamso fazer bem parecido, só que agora vamos estar do lado do user que colocou o pet para adoção, basicamente essa rota vai servir para mudarmos o nosso atributo AVAILABLE, se o usuario que o colocou para a adoção mudar essa variavel para false, significa que ele nao esta mais disponivel! 
Assim, vamos fazer nossas checks se o pet existe, vamos verificar se o pet é do user que quer colocar para a adoção: 
        //check if logged in user registered the pet
        const token = getToken(req)
        const user = await getUserByToken(token)

        if (pet.user._id.toString() !== user._id.toString()) {
            res.status(422).json({ message: "Houve um problema em processar a sua solicitação, tente mais tarde!" })
            return
        }

Sendo assim o usuario que tem o pet confirme a adoção do seu pet, dai entao o atributo available = false. 

depois vamos só finalizar com nosso: 
        await Pet.findByIdAndUpdate(id, pet)

        res.status(200).json({ message: "Parabéns o ciclo de adoção foi atualizado com sucesso!" })

                            ///////////////////
                             
==> ==> ==> ==> ==>  TÉRMINO DO BACK END DA APLICAÇÃO <== <== <== <== <== 
                            
                            ///////////////////

