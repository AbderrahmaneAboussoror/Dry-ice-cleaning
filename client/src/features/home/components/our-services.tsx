import ServiceCard from "@/features/home/components/service-card";
import service1 from "@/assets/service-1.png";
import service2 from "@/assets/service-2.png";
import service3 from "@/assets/service-3.png";

interface ServiceCardProps {
  title: string;
  subtitle: string;
  description: string;
  imageSrc: string;
  button: string;
  imageAlt: string;
  navigation?: string;
  navigationButton?: string;
  disabled?: boolean;
}

const OurServices = () => {
  const services: ServiceCardProps[] = [
    {
      title: "engine bay cleaning",
      subtitle: "automotive cleaning",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus dignissimos voluptatum impedit cupiditate autem nihil illum repellat dolores deserunt nisi aliquam et blanditiis quidem eius velit ipsa perspiciatis obcaecati accusantium,",
      button: "learn more",
      imageSrc: service1,
      imageAlt: service1,
      navigation: "#appointment",
      navigationButton: "Make Appointment",
    },
    {
      title: "heavy machinery",
      subtitle: "industrial equipement cleaning",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus dignissimos voluptatum impedit cupiditate autem nihil illum repellat dolores deserunt nisi aliquam et blanditiis quidem eius velit ipsa perspiciatis obcaecati accusantium,",
      button: "learn more",
      imageSrc: service2,
      imageAlt: service2,
      navigation: "#contact",
      navigationButton: "Contact Us",
    },
    {
      title: "home services",
      subtitle: "residential cleaning",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus dignissimos voluptatum impedit cupiditate autem nihil illum repellat dolores deserunt nisi aliquam et blanditiis quidem eius velit ipsa perspiciatis obcaecati accusantium,",
      button: "coming soon",
      imageSrc: service3,
      imageAlt: service3,
      disabled: true
    },
  ];

  return (
    <div className="w-full space-y-5 px-5">
      <p className="text-4xl font-semibold capitalize">our services</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-14">
        {services.map((service, i) => (
          <ServiceCard
            key={i}
            title={service.title}
            subtitle={service.subtitle}
            description={service.description}
            imageSrc={service.imageSrc}
            imageAlt={service.imageAlt}
            button={service.button}
            navigation={service.navigation}
            navigationButton={service.navigationButton}
          />
        ))}
      </div>
    </div>
  );
};

export default OurServices;
