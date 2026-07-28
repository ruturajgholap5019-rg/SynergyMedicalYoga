# Migration TODO

## Content Still Needed From Synergy Team

- Final product catalog, SKUs, images, dimensions, prices, stock rules.
- Official team biographies and headshots.
- Verified testimonials with consent.
- Blog article bodies and featured images.
- FAQ answers reviewed by the business/clinical team.
- Final legal policies: privacy, terms, return/refund, shipping.
- Gallery and video feedback assets.
- Course calendar, syllabus, batch dates, pricing, and registration workflow.
- Therapist and center directory data.

## WordPress URL Redirect Map To Prepare

- `/our-services/` -> `/services`
- `/about-medical-yoga-therapy/` -> `/about`
- `/team/` -> `/team`
- `/dashboard/` -> `/my-account`
- `/return-refund-policy/` -> `/return-refund-policy`
- `/privacy-policy/` -> `/privacy-policy`
- `/terms-and-conditions/` -> `/terms-and-conditions`
- `/shipping-delivery-policy/` -> `/shipping-policy`
- `/product/<wordpress-slug>/` -> `/product/<new-slug>`
- blog slugs -> `/blogs` or future `/blog/<slug>`

## Implementation Notes

CMS content is now represented by `ContentItem` records typed as `blog`, `faq`, `testimonial`, `gallery`, `video`, `course`, `courseBatch`, `team`, `policy`, or `page`.
