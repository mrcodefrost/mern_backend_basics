// const fs = require('fs')
const fsPromises = require('fs').promises
const path = require('path')


const fileOps = async () => {
    try {
        const data = await fsPromises.readFile(path.join(__dirname, 'files', 'starter.txt'), 'utf-8')
        console.log(data)
        await fsPromises.unlink(path.join(__dirname, 'files', 'starter.txt'))
        await fsPromises.writeFile(path.join(__dirname, 'files', 'newFile.txt'), data)
        await fsPromises.appendFile(path.join(__dirname, 'files', 'newFile.txt'), '\nAppended with fsPromises')
        await fsPromises.rename(path.join(__dirname, 'files', 'newFile.txt'), path.join(__dirname, 'files', 'renamed.txt'))
        const newData = await fsPromises.readFile(path.join(__dirname, 'files', 'renamed.txt'), 'utf-8');
        console.log('Updated data : ', newData)    

    } catch (error) {
        console.error(error)
    }
}

fileOps()


// fs.readFile('./files/starter.txt', 'utf-8', (err, data) => {
//     if (err) throw err;
//     console.log(data);
// })

// fs.readFile('./files/idontexist.txt', 'utf-8', (err, data) => {
//     if(err) throw err;
//     console.log(data);
// })


// Method 1 : Calling functions in a nested manner resulting in callback hell

// fs.writeFile(path.join(__dirname, 'files', 'starter.txt'), 'Nice to meet you', (err) => {
//     if (err) throw err;
//     console.log('Write complete')

//     // will update if file exists else create file and then update
//     // due to async nature of these methods, better to keep append file
//     // nested inside the write file scope
//     fs.appendFile(path.join(__dirname, 'files', 'starter.txt'), 'Testing text', (err) => {
//         if (err) throw err;
//         console.log('Append complete')

//         fs.rename(path.join(__dirname, 'files', 'starter.txt'), path.join(__dirname, 'files', 'renamed.txt'), (err) => {
//             if (err) throw err;
//             console.log('Rename complete')
//         })
//     })
// })


// Method 2 


// exit on uncaught errors

process.on('uncaughtException', err => {
    console.error('There was an uncaught error', err)
    process.exit(1);
})