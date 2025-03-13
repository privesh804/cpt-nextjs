interface TeamMember {
  contact?: string;
  reg?: string;
  email?: string;
  id?: number;
  status?: boolean;
  designation?: string;
  image?: StaticImageData;
  name: string;
}

interface DashboardCard {
  icon: React.ReactNode;
  heading: string;
  count: string;
  chart: StaticImageData;
  backgroundColor: string;
}
type LogoProps = SVGProps<SVGSVGElement>;
