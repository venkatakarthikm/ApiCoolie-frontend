import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Check } from 'lucide-react';
import { Button } from '../components/ui/Button.jsx';
import { Link } from 'react-router-dom';

export function PricingPage() {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      description: 'Perfect for small side projects and developer exploration.',
      features: [
        'Up to 20 active jobs',
        '1-minute minimum execution cycle',
        '20 daily AI Insights explanation credits',
        'Default webhook delivery support',
        'Basic SVG/JSON status badges',
        'Unlimited JSON Formatter & Suite access',
      ],
      cta: 'Get Started',
      link: '/signup',
      popular: false,
    },
    {
      name: 'Pro',
      price: '$15',
      period: '/month',
      description: 'Ideal for small production apps and business cron integrations.',
      features: [
        'Up to 150 active jobs',
        '1-second precise execution cycles',
        '150 daily AI Insights explanation credits',
        'Webhook delivery + Webhook HMAC signatures',
        'Customize badge styles and label overrides',
        '14-day history details retention window',
        'Unlimited JSON Formatter & Suite access',
      ],
      cta: 'Upgrade to Pro',
      link: '/signup',
      popular: true,
    },
    {
      name: 'Team',
      price: '$49',
      period: '/month',
      description: 'Designed for engineering operations and microservice backends.',
      features: [
        'Unlimited active jobs',
        '1-second precise execution cycles',
        'Unlimited AI Insights credits',
        'Multi-scoped personal API tokens',
        'Advanced retry policies and exponential backoffs',
        '30-day full details history logs',
        'Priority Slack support channels',
        'Unlimited JSON Formatter & Suite access',
      ],
      cta: 'Start Team Trial',
      link: '/signup',
      popular: false,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 sm:py-24 space-y-12">
      <Helmet>
        <title>Pricing | Api Coolie</title>
        <meta name="description" content="Flexible pricing plans for Api Coolie. Run scheduled APIs and scripts with 1-second precisions. Get started for free." />
        <meta property="og:title" content="Pricing | Api Coolie" />
        <meta property="og:description" content="Flexible pricing plans for Api Coolie. Run scheduled APIs and scripts with 1-second precisions. Get started for free." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://apicoolie.stackinfi.in/pricing" />
        <meta property="og:image" content="https://apicoolie.stackinfi.in/Api%20Coolie.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Pricing | Api Coolie" />
        <meta name="twitter:description" content="Flexible pricing plans for Api Coolie. Run scheduled APIs and scripts with 1-second precisions. Get started for free." />
        <meta name="twitter:image" content="https://apicoolie.stackinfi.in/Api%20Coolie.png" />
      </Helmet>

      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Flexible plans for active developers</h1>
        <p className="text-lg text-muted-foreground">Choose the volume that fits your production microservices and task loops.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`flex flex-col p-8 rounded-3xl border bg-card relative ${
              plan.popular ? 'border-primary ring-2 ring-primary/20' : 'border-border/40'
            }`}
          >
            {plan.popular && (
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Most Popular
              </span>
            )}
            
            <div className="space-y-4 mb-6">
              <h3 className="text-xl font-bold">{plan.name}</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold">{plan.price}</span>
                {plan.period && <span className="text-muted-foreground text-sm">{plan.period}</span>}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{plan.description}</p>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {plan.features.map((feat) => (
                <li key={feat} className="flex gap-2.5 items-start text-xs text-muted-foreground">
                  <Check className="h-4.5 w-4.5 text-primary shrink-0" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>

            <Link to={plan.link}>
              <Button
                variant={plan.popular ? 'primary' : 'outline'}
                className="w-full font-semibold py-2.5 text-sm"
              >
                {plan.cta}
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
