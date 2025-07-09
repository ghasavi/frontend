import { createClient } from "@supabase/supabase-js"

const url = "https://zvhnqhsakoxjziurenya.supabase.co"
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2aG5xaHNha294anppdXJlbnlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3MjA3MTYsImV4cCI6MjA2NzI5NjcxNn0.OD7F8_bKVHaODAAkWsuvoZWIxOESPYDfS313-JQzzhI"

const supabase = createClient(url,key)

export default function mediaUpload(file){

    const mediaUploadPromise = new Promise(
        (resolve, reject)=>{

            if(file == null){
                reject("No file selected")
                return
            }

            const timestamp = new Date().getTime()
            const newName = timestamp+file.name

            supabase.storage.from("aviimages").upload(newName, file, {
                upsert:false,
                cacheControl:"3600"
            }).then(()=>{
                const publicUrl = supabase.storage.from("aviimages").getPublicUrl(newName).data.publicUrl
                resolve(publicUrl)
            }).catch(
                ()=>{
                    reject("Error occured in supabase connection")
                }
            )
        }
    )

    return mediaUploadPromise

}
//https://zvhnqhsakoxjziurenya.supabase.co