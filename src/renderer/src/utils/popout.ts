type WindowLocationType = 'popup' | 'popout' | 'options' | 'unknown'

export const getWindowLocationType = () =>
  (new URLSearchParams(location.search).get('location') ?? 'unknown') as WindowLocationType
