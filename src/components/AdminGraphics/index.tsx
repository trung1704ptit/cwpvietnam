/* eslint-disable @next/next/no-img-element */
import React from 'react'

const SITE_NAME = 'Cancer Wellness Program'

/** Login, signup and password screens. Both variants render; `custom.scss` shows one per admin theme. */
export const AdminLogo: React.FC = () => (
  <div className="cwp-admin-logo">
    <img
      alt={SITE_NAME}
      className="cwp-admin-logo__img cwp-admin-logo__img--light"
      height={169}
      src="/logo-text.png"
      width={499}
    />
    <img
      alt={SITE_NAME}
      className="cwp-admin-logo__img cwp-admin-logo__img--dark"
      height={86}
      src="/logo-white.png"
      width={238}
    />
  </div>
)

/** Small square mark in the admin nav and breadcrumbs. */
export const AdminIcon: React.FC = () => (
  <img alt={SITE_NAME} className="cwp-admin-icon" height={169} src="/logo-icon.png" width={170} />
)
