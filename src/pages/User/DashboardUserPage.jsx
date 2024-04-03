import { useState } from "react";
import assets from "../../assets";
import FooterPage from "../../components/FooterPage";
import { Scrollbar } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import NavbarUserPage from "../../components/NavbarUserPage";

const DashboardUserPage = () => {
  return (
    <>
      <div className="min-h-screen bg-slate-100">
        <NavbarUserPage></NavbarUserPage>
        <div className="flex items-center justify-center">
          <Swiper
            scrollbar={{
              hide: true,
            }}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            navigation={true}
            modules={[Scrollbar, Autoplay, Navigation]}
            className="mySwiper"
          >
            <SwiperSlide>
              <img src={assets.tth_image_1} alt="" />
            </SwiperSlide>
            <SwiperSlide>
              <img src={assets.tth_image_2} alt="" />
            </SwiperSlide>
            <SwiperSlide>
              <img src={assets.tth_image_3} alt="" />

            </SwiperSlide>
          </Swiper>
        </div>
        <section id="partner" className="flex flex-col items-center justify-center py-unit-4xl mx-unit-2xl">
          <span className="mb-5 text-5xl font-bold">Our Partner</span>
          <div className="flex flex-col items-center gap-unit-3xl md:flex-row">
            <img src={assets.depkominfo} className="w-[25rem] h-auto mb-5 md:mr-5" alt="" />
            <div className="border-r border-gray-500 h-[20rem] hidden md:block"></div>
            <img src={assets.ISO_17025} className="w-[20rem] h-auto mb-5 md:mr-5" alt="" />
            <div className="border-r border-gray-500 h-[20rem] hidden md:block"></div>
            <img src={assets.komite_akreditasi_nasional} className="w-[25rem] h-auto mb-5 md:mr-5" alt="" />
          </div>
        </section>

      </div>
      <FooterPage />
    </>

  )
}

export default DashboardUserPage