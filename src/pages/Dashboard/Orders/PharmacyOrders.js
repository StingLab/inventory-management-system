import React from 'react';
import SaveButton from '../../../components/Buttons/SaveButton';
import CancelButton from '../../../components/Buttons/CancelButton';
import PrintButton from '../../../components/Buttons/PrintButton';
import NewButton from '../../../components/Buttons/NewButton';
import Input from '../../../components/FormComponents/Input';
import Select from '../../../components/FormComponents/Select';
import ModalCloseButton from '../../../components/Buttons/ModalCloseButton';
import ModalHeading from '../../../components/Headings/ModalHeading';
import { useState } from 'react';
import { useEffect } from 'react';
import RefreshButton from '../../../components/Buttons/RefreshButton';
import TableRow from '../../../components/TableRow';
import EditButton from '../../../components/Buttons/EditButton';
import DeleteButton from '../../../components/Buttons/DeleteButton';
import { toast } from 'react-toastify';
import TotalItems from '../../../components/TotalItems';

const PharmacyOrders = () => {
    const tableHeadItems = ['SN', 'Voucher', 'Supplier', 'Status', 'Quantity', 'TP', 'Vat', 'Discount', 'MRP', 'Creator', 'Created At', 'Actions'];

    const modalTableHeadItems1 = ['SN', 'Name', 'Strength', 'Company', 'Category', 'Pack Type', 'TP'];

    const modalTableHeadItems2 = ['SN', 'Name', 'Strength', 'Category', 'Stock', 'Quantity', 'Total TP', 'Action'];

    const tableHead = <tr>
        {
            tableHeadItems?.map((tableHeadItem, index) => <th key={index} className='text-xs md:text-2xs lg:text-md' >{tableHeadItem}</th>)
        }
    </tr>;

    const modalTableHead1 = <tr>
        {
            modalTableHeadItems1?.map((tableHeadItem, index) => <th key={index} className='text-xs md:text-2xs lg:text-md' >{tableHeadItem}</th>)
        }
    </tr>;

    const modalTableHead2 = <tr>
        {
            modalTableHeadItems2?.map((tableHeadItem, index) => <th key={index} className='text-xs md:text-2xs lg:text-md' >{tableHeadItem}</th>)
        }
    </tr>;

    // add pharmacy order to db
    const addPharmacyOrder = event => {
        event.preventDefault();

        const supplier = event?.target?.supplier?.value; const tradeName = event?.target?.tradeName?.value;
        const category = event?.target?.category?.value;
        const strength = event?.target?.strength?.value;
        const boxType = event?.target?.boxType?.value;
        const unitType = event?.target?.unitType?.value;
        const creator = 'admin';
        const createdAt = new Date();

        const productDetails = { supplier, tradeName, category, strength, boxType, unitType, creator, createdAt };

        // send data to server
        fetch('https://stringlab-ims-server.herokuapp.com/api/orders/pharmacy', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(productDetails)
        })
            .then(res => res.json())
            .then(data => {
                toast(
                    <div className="alert alert-success shadow-lg">
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span>{tradeName} added successfully.</span>
                        </div>
                    </div>
                );
            });

        event.target.reset();
    };

    const [pharmacyOrders, setPharmacyOrders] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [unitTypes, setUnitTypes] = useState([]);

    // get all pharmacy orders
    useEffect(() => {
        fetch('https://stringlab-ims-server.herokuapp.com/api/orders/pharmacy')
            .then(res => res.json())
            .then(products => setPharmacyOrders(products));
    }, [pharmacyOrders]);

    // get categories data
    useEffect(() => {
        fetch('https://stringlab-ims-server.herokuapp.com/api/setup/categories')
            .then(res => res.json())
            .then(c => setCategories(c));
    }, [categories]);

    // get all suppliers data
    useEffect(() => {
        fetch('https://stringlab-ims-server.herokuapp.com/api/suppliers/lists')
            .then(res => res.json())
            .then(s => setSuppliers(s));
    }, [suppliers]);

    // get unit types data
    useEffect(() => {
        fetch('https://stringlab-ims-server.herokuapp.com/api/setup/unitTypes')
            .then(res => res.json())
            .then(ut => setUnitTypes(ut));
    }, [unitTypes]);

    return (
        <section className='lg:p-4 md:p-2 p-1'>
            <div className="flex flex-col md:flex-row lg:flex-row justify-between items-center gap-y-2 mb-6">
                <h2 className='lg:text-2xl md:text-xl text-lg text-center font-bold'>Pharmacy Orders: <TotalItems text={pharmacyOrders.length} /></h2>

                <div className='flex items-center gap-x-4'>
                    <NewButton modalId='create-new-product' btnSize='btn-xs' />
                    <RefreshButton btnSize='btn-xs' />
                    <PrintButton btnSize='btn-xs' />
                </div>
            </div>

            <input type="checkbox" id="create-new-product" className="modal-toggle" />
            <label htmlFor="create-new-product" className="modal cursor-pointer">
                <label className="modal-box w-11/12 max-w-5xl relative" htmlFor="">
                    <ModalCloseButton modalId={'create-new-product'} />

                    <ModalHeading modalHeading={'Create a Pharmacy Order'} />

                    <form onSubmit={addPharmacyOrder}>
                        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-4 gap-y-1 mb-2'>
                            <Select title={'Supplier'} name='supplier' isRequired='required' options={suppliers.map(s => s.name)} />
                            <Input title={'Trade Name'} type='text' placeholder='Trade name' name='tradeName' isRequired='required' />
                            <Select title={'Category'} name='category' isRequired='required' options={categories.map(c => c.name)} />

                            <Input title={'Strength'} type='text' placeholder='Strength' name='strength' isRequired='required' />

                            <Select title={'Box Type'} name='boxType' isRequired='required' />
                            <Select title={'Unit Type'} name='unitType' isRequired='required' options={unitTypes.map(u => u.name)} />
                        </div>

                        <div className="flex flex-col w-full lg:flex-row mt-4 place-content-center">
                            <div className="grid">
                                <table className="table table-zebra table-compact">
                                    <thead>
                                        {
                                            modalTableHead1
                                        }
                                    </thead>
                                    <tbody>
                                        {
                                            pharmacyOrders.map((product, index) =>
                                                <TableRow
                                                    key={product._id}
                                                    tableRowsData={
                                                        [
                                                            index + 1,
                                                            product.name,
                                                            product.strength,
                                                            product.company,
                                                            product.category,
                                                            product.packType,
                                                            product.Tp,
                                                        ]
                                                    } />)
                                        }
                                    </tbody>
                                </table>

                                <SaveButton extraClass={'mt-4'} />
                            </div>

                            <div className="divider lg:divider-horizontal"></div>

                            <div className="grid">

                                <table className="table table-zebra table-compact">
                                    <thead>
                                        {
                                            modalTableHead2
                                        }
                                    </thead>
                                    <tbody>
                                        {
                                            pharmacyOrders.map((product, index) =>
                                                <TableRow
                                                    key={product._id}
                                                    tableRowsData={
                                                        [
                                                            index + 1,
                                                            product.name,
                                                            product.strength,
                                                            product.category,
                                                            product.stock,
                                                            product.quantity,
                                                            product.totalTp,
                                                            <span className='flex items-center gap-x-1'>
                                                                <EditButton />
                                                                <DeleteButton
                                                                    deleteApiLink='https://stringlab-ims-server.herokuapp.com/api/orders/pharmacy/'
                                                                    itemId={'pharmacyOrder._id'} />
                                                            </span>
                                                        ]
                                                    } />)
                                        }
                                    </tbody>
                                </table>

                                <CancelButton extraClass={'mt-4'} />
                            </div>
                        </div>
                    </form>
                </label>
            </label>

            <table className="table table-zebra table-compact">
                <thead>
                    {
                        tableHead
                    }
                </thead>
                <tbody>
                    {
                        pharmacyOrders.map((pharmacyOrder, index) =>
                            <TableRow
                                key={pharmacyOrder._id}
                                tableRowsData={
                                    [
                                        index + 1,
                                        pharmacyOrder.voucher,
                                        pharmacyOrder.supplier,
                                        pharmacyOrder.status,
                                        pharmacyOrder.quantity,
                                        pharmacyOrder.status,
                                        pharmacyOrder.vat,
                                        pharmacyOrder.discount,
                                        pharmacyOrder.mrp,
                                        pharmacyOrder.creator,
                                        pharmacyOrder?.createdAt?.slice(0, 10),
                                        <span className='flex items-center gap-x-1'>
                                            <EditButton />
                                            <DeleteButton
                                                deleteApiLink='https://stringlab-ims-server.herokuapp.com/api/orders/pharmacy/'
                                                itemId={pharmacyOrder._id} />
                                        </span>
                                    ]
                                } />)
                    }
                </tbody>
            </table>
        </section >
    );
};

export default PharmacyOrders;