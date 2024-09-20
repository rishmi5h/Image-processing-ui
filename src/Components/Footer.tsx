import {
  FaEnvelope,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
} from 'react-icons/fa';

const SocialIcon = ({
  Icon,
  link,
  name,
}: {
  Icon: React.ElementType;
  link: string;
  name: string;
}) => {
  return (
    <a
      aria-label={`Visit ${name}`}
      className={`text-white-800 block transition-colors hover:text-purple-600`}
      href={link}
      rel="noopener noreferrer"
      target="_blank"
    >
      <Icon className="sm:text-2xl" size={20} />
    </a>
  );
};

const Footer = () => {
  return (
    <footer className="bg-neutral-800 bg-opacity-75 p-4 text-center text-neutral-500">
      <div className="flex justify-center space-x-2 sm:space-x-4">
        <SocialIcon
          Icon={FaGithub}
          link="https://github.com/rishmi5h"
          name="GitHub Profile"
        />
        <SocialIcon
          Icon={FaLinkedin}
          link="https://www.linkedin.com/in/rishmi5h/"
          name="LinkedIn Profile"
        />
        <SocialIcon
          Icon={FaInstagram}
          link="https://www.instagram.com/rishmi5h/"
          name="Instagram Profile"
        />
        <SocialIcon
          Icon={FaTwitter}
          link="https://twitter.com/rishmi5h"
          name="Twitter Profile"
        />
        <SocialIcon
          Icon={FaEnvelope}
          link="mailto:mail@rishmi5h.com"
          name="Email"
        />
      </div>
    </footer>
  );
};

export default Footer;
