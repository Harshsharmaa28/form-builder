
import { FormTemplate } from '@/types/form';
import { v4 as uuidv4 } from 'uuid';

export const predefinedTemplates: FormTemplate[] = [
  {
    id: 'contact-us',
    name: 'Contact Us',
    description: 'A simple contact form with name, email, and message fields',
    schema: {
      title: 'Contact Us',
      description: 'Get in touch with us',
      fields: [
        {
          id: uuidv4(),
          type: 'text',
          label: 'Full Name',
          placeholder: 'Enter your full name',
          required: true,
          step: 0
        },
        {
          id: uuidv4(),
          type: 'email',
          label: 'Email Address',
          placeholder: 'Enter your email',
          required: true,
          step: 0
        },
        {
          id: uuidv4(),
          type: 'textarea',
          label: 'Message',
          placeholder: 'Enter your message',
          required: true,
          validation: { minLength: 10 },
          step: 0
        }
      ],
      steps: [
        {
          id: uuidv4(),
          title: 'Contact Information',
          fields: []
        }
      ],
      isMultiStep: false
    }
  },
  {
    id: 'job-application',
    name: 'Job Application',
    description: 'Multi-step job application form',
    schema: {
      title: 'Job Application',
      description: 'Apply for a position at our company',
      fields: [
        {
          id: uuidv4(),
          type: 'text',
          label: 'First Name',
          placeholder: 'Enter your first name',
          required: true,
          step: 0
        },
        {
          id: uuidv4(),
          type: 'text',
          label: 'Last Name',
          placeholder: 'Enter your last name',
          required: true,
          step: 0
        },
        {
          id: uuidv4(),
          type: 'email',
          label: 'Email',
          placeholder: 'Enter your email',
          required: true,
          step: 0
        },
        {
          id: uuidv4(),
          type: 'phone',
          label: 'Phone Number',
          placeholder: 'Enter your phone number',
          required: true,
          step: 1
        },
        {
          id: uuidv4(),
          type: 'select',
          label: 'Position Applied For',
          required: true,
          options: ['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'UI/UX Designer'],
          step: 1
        },
        {
          id: uuidv4(),
          type: 'textarea',
          label: 'Cover Letter',
          placeholder: 'Tell us why you want to work here',
          required: true,
          validation: { minLength: 50 },
          step: 2
        }
      ],
      steps: [
        {
          id: uuidv4(),
          title: 'Personal Information',
          fields: []
        },
        {
          id: uuidv4(),
          title: 'Position Details',
          fields: []
        },
        {
          id: uuidv4(),
          title: 'Additional Information',
          fields: []
        }
      ],
      isMultiStep: true
    }
  },
  {
    id: 'event-registration',
    name: 'Event Registration',
    description: 'Event registration form with participant details',
    schema: {
      title: 'Event Registration',
      description: 'Register for our upcoming event',
      fields: [
        {
          id: uuidv4(),
          type: 'text',
          label: 'Full Name',
          placeholder: 'Enter your full name',
          required: true,
          step: 0
        },
        {
          id: uuidv4(),
          type: 'email',
          label: 'Email Address',
          placeholder: 'Enter your email',
          required: true,
          step: 0
        },
        {
          id: uuidv4(),
          type: 'date',
          label: 'Date of Birth',
          required: true,
          step: 0
        },
        {
          id: uuidv4(),
          type: 'select',
          label: 'T-Shirt Size',
          required: true,
          options: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
          step: 0
        },
        {
          id: uuidv4(),
          type: 'checkbox',
          label: 'I agree to the terms and conditions',
          required: true,
          step: 0
        }
      ],
      steps: [
        {
          id: uuidv4(),
          title: 'Registration Details',
          fields: []
        }
      ],
      isMultiStep: false
    }
  }
];
