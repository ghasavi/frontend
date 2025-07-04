import {useState} from 'react';
import {sampleProducts} from "../../assets/sampleData"
import axios from 'axios';

export default function AdminProductPage(){
    const [products, setProducts] = useState(sampleProducts);

    useEffect(()=>{
        axios.get(import.meta.env.VITE_BACKEND_URL + "/api/products")
    .then((res)=>{
        console.log(res.data)
        setProducts(res.data);
    })
    })
    
    return(
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100" >
            <table>
                <thead>
                    <tr>
                        <th>Product Id</th>
                        <th>Product Name</th>
                        <th>Product Image</th>
                        <th>Labelled Price</th>
                        <th>Price</th>
                        <th>Stock</th>
                    </tr>
                </thead>

                <tbody>
                    {
                        products.map(
                            (item,index)=>{
                                return(
                                    <tr key={index}>
                                        <td>{item._id}</td>
                                        <td>{item.name}</td>
                                        <td><img src={item.image} alt={item.name} className="w-20 h-20"/></td>
                                        <td>{item.labelledPrice}</td>
                                        <td>{item.price}</td>
                                        <td>{item.stock}</td>
                                    </tr>
                                )
                            }
                        )
                    }
                 
                </tbody>
            </table>


                </div>
    )
}