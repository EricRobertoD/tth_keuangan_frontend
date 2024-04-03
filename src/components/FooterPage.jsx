import React from 'react';
import assets from '../assets';

const FooterPage = () => {
    return (
        <>
            <footer className="min-w-full bg-gray-200">
                <div className="flex flex-col items-center justify-center gap-6 p-4 md:flex-row">
                    <div className="pl-40 text-center md:text-left">
                        <img src={assets.logoTTH} className="w-[35rem] h-auto" alt="Logo" />
                        <div className="mt-2 text-center text-xl">Telecommunication Device Testing Service</div>
                    </div>
                    <div className="pl-40 text-center md:text-left">
                        <div className="mt-2 text-xl font-bold">Address :</div>
                        <div className="mt-2 text-xl">Jl. Gegerkalong Hilir No.47, Gegerkalong, Kec. Sukasari Kota Bandung, Jawa Barat 40152</div>
                        <div className="mt-4 text-xl font-bold">Customer Service TTH :</div>
                        <div className="mt-2 text-xl">(+62) 812-2483-7500</div>
                        <div className="mt-1 text-xl font-bold">Email :</div>
                        <div className="mt-2 text-xl">cstth@telkom.co.id</div>
                        <div className="mt-4 text-xl font-bold">Operational Time :</div>
                        <div className="mt-2 text-xl">Mon - Fri : 09.00 am - 17.00 pm</div>
                    </div>
                    <div className="p-40">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3961.146382711605!2d107.58303549678955!3d-6.873058099999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e767e572539b%3A0xd9d0847b9cbb3fb8!2sTelkom%20Direktorat%20Digital%20Business!5e0!3m2!1sid!2sid!4v1708919152738!5m2!1sid!2sid"
                            width="600"
                            height="450"
                            style={{ border: '0' }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                </div>
            </footer>
            <footer className="min-w-full bg-black text-white text-center py-4">
                Copyrights © {new Date().getFullYear()} All Rights Reserved by Telkom Test House
            </footer>
        </>
    );
};

export default FooterPage;
