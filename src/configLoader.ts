import {readdir, readFile} from "fs/promises"

import {parse} from "yaml"
import * as path from "path";

export async function readAndParseFile<Type>(fileName: string, typeSpec: any): Promise<Type> {
    const data = await readFile(fileName, "utf8")
    const parsed = parse(data)
    try {
        // "If the object doesn't conform to the type specification, check will throw an exception."
        const data: Type = typeSpec.check(parsed)
        return Promise.resolve(data)
    } catch ({details}) {
        // "If the object doesn't conform to the type specification, print out why in detail, so users can fix."
        console.error(`there was an error validating the file with name: ${fileName}`)
        console.error(`these constraints where NOT OK: ${JSON.stringify(details)}`)
        return Promise.reject(`there was an error validating the file '${fileName}', see Diagnostics for more details`)
    }
}


export async function readAndParseFilesInFolder<theType>(folderName: string, typeSpec: any): Promise<theType[]> {
    let fullDataSet: theType[] = [] as any
    var errs = [];
    //read all files in folder
    const files = await readdir(folderName)
    for (const fileName of files) {
        try {
            //read and parse each file
            const data: theType = await readAndParseFile<theType>(path.join(folderName, fileName), typeSpec)
            fullDataSet.push(data)
        } catch (err) {
            errs.push(err)
        }
    }
    if (errs.length !== 0) {
        return Promise.reject(errs.join("\n"))
    }
    return Promise.resolve(fullDataSet)
}
