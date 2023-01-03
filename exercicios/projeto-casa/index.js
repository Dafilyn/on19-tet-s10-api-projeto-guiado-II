const express = require('express');
const app = express();
const port = 3000;
const clientAccountList = require('./model/contas-clientes.json')

app.use(express.json());

const { uuid } = require('uuidv4');

app.post('/client/add',(req,res)=>{
    const {nome_cliente, cpf_cliente, data_nascimento, pais, email, conta} = req.body;
    const newClient ={
        id: uuid(),
        nome_cliente: nome_cliente,
        cpf_cliente: cpf_cliente,
        data_nascimento: data_nascimento,
        pais: pais,
        email: email,
        conta: conta,
    };

    clientAccountList.push(newClient);
    return res.json(newClient);

})

app.put('/client/:id/atualizar', (req,res)=>{
    const idClient = req.params.id
    const newAdrr = req.body

    const clientExist = clientAccountList.find(client => client.id === idClient)
    if(clientExist){
        const newinfo  = {
            ...clientExist,
            ...newAdrr,

        };
        clientAccountList.map(((client,index) => {
            if(client.id === idClient){
                clientAccountList[index] = newinfo
            }
        }))
        return res.status(200).json({message:"Cliente atualizado com susseso!", client: updatedBalance})
    }
    clientAccountList.push(updatedBalance)
    
    return res.status(201).json({message: "Id não encontrado, um cliente foi criado!", client: updatedBalance})
})


//Encerrar contas de clientes ( DELETE )
app.delete('/client/:id/encerrar', (req,res)=>{
    const idClient = req.params.id
    const clientExist = clientAccountList.find(client => client.id === idClient)
    if(clientExist){
        const clientIndex = clientAccountList.indexOf(clientExist)
        clientAccountList.splice(clientIndex,1)
        return res.status(200).json({message: "Conta encerrada com sucesso!"})
    }
    return res.status(404).json({message: "Cliente não encontrado!"})
})

// Conseguir Filtrar os clientes do banco pelo seu nome,por saldo...
app.get('/client/:id', (req,res)=>{
    const idClient = req.params.id
    const nome = req.query.nome
    const tipoConta = req.query.tipoConta?.toLowerCase()
    
    if(idClient || nome || tipoConta){
    const clientesFiltrados = listaClientesBanco.filter((cliente)=>{
        if(idClient){
            return cliente.id === idClient
        }
        if(nome){
            return cliente.nome_cliente.toLowerCase() == filtroNome.toLowerCase()
        }
        if(tipoConta){
            return cliente.conta.tipoConta.toLowerCase() == tipoConta.toLowerCase()
        }
        return cliente
    })
    return res.status(200).json(clientesFiltrados)
    }else {
        return res.status(404).json({message: "Cliente não encontrado!"})
    }
})

//fazer um deposito
app.patch('/client/:id/deposito', (req,res)=>{
    const idClient = req.params.id
    const {valorDeposito} = req.body

    const clientExist = clientAccountList.find(client => client.id === idClient)
    if(clientExist){
        const newBalance = {
            ...clientExist,
            conta: {
                ...clientExist.conta,
                saldo: clientExist.conta.saldo + valorDeposito
            }
        }
        clientAccountList.map(((client,index) => {
            if(client.id === idClient){
                clientAccountList[index] = newBalance
            }
        }))
        return res.status(200).json({message:"Deposito realizado com susseso!", client: newBalance})
    }
    return res.status(404).json({message: "Cliente não encontrado!"})
})

//fazer um saque
app.patch('/client/:id/saque', (req,res)=>{
    const idClient = req.params.id
    const {valorSaque} = req.body

    const clientExist = clientAccountList.find(client => client.id === idClient)
    if(clientExist){
        const newBalance = {
            ...clientExist,
            conta: {
                ...clientExist.conta,
                saldo: clientExist.conta.saldo - valorSaque
            }
        }
        clientAccountList.map(((client,index) => {
            if(client.id === idClient){
                clientAccountList[index] = newBalance
            }
        }))
        return res.status(200).json({message:"Saque realizado com susseso!", client: newBalance})
    }
    return res.status(404).json({message: "Cliente não encontrado!"})
})

app.listen(port,()=>{
    console.log(`Api esta rodando na porta ${port}`);
  })
