'use client'

import React, { useState, useRef, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { createPortal } from 'react-dom'
import Image from 'next/image'

import {
  FileText,
  ShoppingBag,
  BarChart,
  Search,
  Calendar,
  File,
  MoreVertical,
  ChevronDown,
  ChevronRight,
  Send,
  Flame,
  Box,
  LayoutDashboard,
  LucideProps,
  Spade,
  CalendarDays,
  Newspaper,
} from 'lucide-react'
import { useUIStore } from '@/lib/store/uiStore'
import { useChatStore } from '@/lib/store/chatStore'
import { useAuthStore } from '@/lib/store/authStore'
import image22 from '@/components/assets/image22.png'
import { BiStoreAlt } from 'react-icons/bi'

export const ContentLayoutIcon = ({ size = 24, color = "currentColor", className = "", ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    {/* Outer Rounded Rectangle (Main device frame) */}
    <rect 
      x="3" 
      y="3" 
      width="18" 
      height="18" 
      rx="4" // Corner radius 
      stroke={color} 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    
    {/* Inner Rounded Rectangle (Main content area) */}
    <rect 
      x="6.5" 
      y="9" 
      width="11" 
      height="8.5" 
      rx="1.5" // Corner radius 
      stroke={color} 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    
    {/* Top left short line (Header/title area) */}
    <path 
      d="M9 6H13" 
      stroke={color} 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

export const AaveIcon = ({ size = 24, className = "", ...props }) => {
  // Calculate height based on aspect ratio (266:139)
  const height = (size * 139) / 266
  return (
    <svg
      width={size}
      height={height}
      viewBox="0 0 266 139"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path d="M97.5418 138.533C112.461 138.533 124.556 126.438 124.556 111.518C124.556 96.5987 112.461 84.5039 97.5418 84.5039C82.6221 84.5039 70.5273 96.5987 70.5273 111.518C70.5273 126.438 82.6221 138.533 97.5418 138.533Z" fill="currentColor"/>
      <path d="M168.149 138.533C183.069 138.533 195.164 126.438 195.164 111.518C195.164 96.5987 183.069 84.5039 168.149 84.5039C153.23 84.5039 141.135 96.5987 141.135 111.518C141.135 126.438 153.23 138.533 168.149 138.533Z" fill="currentColor"/>
      <path d="M132.8 0C59.4497 0 -0.0191954 60.6017 4.64786e-06 135.335H33.9264C33.9264 79.3281 77.8433 33.92 132.8 33.92C187.757 33.92 231.674 79.3281 231.674 135.335H265.6C265.613 60.6017 206.144 0 132.8 0Z" fill="currentColor"/>
    </svg>
  )
}

export const UniswapIcon = ({ size = 24, className = "", ...props }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 96 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path fill="currentColor" d="M32.13 9.558c-1.183-.181-1.233-.202-.676-.287 1.067-.161 3.587.059 5.324.466 4.054.949 7.743 3.38 11.681 7.7l1.046 1.147 1.497-.237c6.305-.998 12.719-.205 18.083 2.236 1.476.672 3.803 2.009 4.094 2.352.093.11.263.815.378 1.567.398 2.601.199 4.596-.609 6.085-.44.81-.464 1.068-.169 1.762.236.553.894.963 1.546.962 1.333-.002 2.768-2.125 3.432-5.078l.265-1.174.523.584c2.87 3.203 5.124 7.57 5.51 10.68l.102.81-.483-.737c-.83-1.268-1.664-2.131-2.732-2.827-1.926-1.255-3.961-1.682-9.353-1.962-4.87-.253-7.626-.663-10.359-1.54-4.65-1.494-6.993-3.483-12.516-10.62-2.453-3.17-3.97-4.925-5.478-6.338-3.427-3.21-6.795-4.893-11.106-5.551Z"></path>
      <path fill="currentColor" d="M74.277 16.636c.123-2.124.415-3.525 1.003-4.805.233-.507.451-.921.485-.921.034 0-.068.374-.225.83-.428 1.243-.498 2.941-.203 4.918.374 2.507.586 2.87 3.277 5.578 1.262 1.27 2.73 2.873 3.262 3.56l.968 1.252-.968-.894c-1.183-1.093-3.905-3.226-4.506-3.53-.403-.205-.463-.201-.711.043-.23.224-.278.562-.31 2.157-.049 2.487-.393 4.083-1.224 5.679-.449.863-.52.679-.113-.295.303-.728.334-1.048.332-3.455-.005-4.837-.588-6-4.006-7.991a37.732 37.732 0 0 0-3.171-1.618c-.878-.385-1.576-.72-1.55-.745.096-.095 3.43.863 4.772 1.372 1.996.756 2.326.854 2.568.763.163-.061.241-.527.32-1.898ZM34.43 24.91c-2.403-3.257-3.89-8.253-3.568-11.987l.1-1.155.546.098c1.027.184 2.798.834 3.627 1.33 2.276 1.36 3.26 3.153 4.263 7.755.293 1.348.678 2.873.856 3.39.285.83 1.363 2.772 2.24 4.033.63.908.212 1.339-1.184 1.215-2.131-.19-5.018-2.152-6.88-4.678ZM71.363 49.16c-11.227-4.454-15.182-8.319-15.182-14.84 0-.96.034-1.745.075-1.745.04 0 .475.316.965.703 2.277 1.8 4.826 2.568 11.884 3.582 4.153.597 6.49 1.079 8.647 1.783 6.853 2.239 11.093 6.782 12.104 12.97.293 1.798.121 5.17-.355 6.947-.376 1.404-1.524 3.934-1.828 4.03-.085.027-.167-.291-.19-.725-.115-2.323-1.306-4.585-3.308-6.28-2.276-1.926-5.335-3.46-12.812-6.426ZM63.481 51.01c-.14-.825-.385-1.878-.542-2.34l-.287-.842.532.589c.737.814 1.319 1.856 1.812 3.243.376 1.06.419 1.374.416 3.095-.003 1.69-.05 2.044-.398 2.997-.548 1.503-1.228 2.57-2.37 3.713-2.05 2.056-4.687 3.195-8.492 3.667-.662.082-2.59.22-4.284.307-4.271.219-7.082.67-9.608 1.544-.363.126-.688.202-.72.17-.103-.1 1.617-1.11 3.038-1.784 2.002-.95 3.996-1.47 8.464-2.202 2.206-.362 4.485-.801 5.064-.976 5.465-1.65 8.274-5.91 7.375-11.182Z"></path>
      <path fill="currentColor" d="M68.628 60.013c-1.492-3.159-1.834-6.209-1.017-9.053.087-.304.228-.553.313-.553.084 0 .436.188.782.417.687.456 2.066 1.224 5.739 3.196 4.583 2.462 7.197 4.368 8.974 6.545 1.556 1.908 2.52 4.08 2.983 6.728.262 1.5.108 5.11-.282 6.621-1.233 4.764-4.097 8.506-8.182 10.69-.599.319-1.136.582-1.194.583-.058.001.16-.545.485-1.214 1.374-2.83 1.53-5.582.491-8.646-.636-1.876-1.933-4.165-4.552-8.033-3.044-4.498-3.791-5.695-4.54-7.281ZM26.456 77.056c4.166-3.465 9.35-5.927 14.073-6.682 2.035-.326 5.425-.197 7.31.278 3.02.762 5.723 2.467 7.128 4.5 1.373 1.986 1.963 3.716 2.576 7.567.242 1.519.505 3.044.585 3.39.46 1.995 1.357 3.59 2.468 4.392 1.765 1.272 4.803 1.351 7.792.203.508-.195.948-.33.98-.3.107.106-1.398 1.099-2.46 1.621-1.428.703-2.564.975-4.074.975-2.738 0-5.01-1.372-6.907-4.169-.373-.55-1.212-2.2-1.864-3.664-2.002-4.499-2.991-5.87-5.316-7.369-2.023-1.305-4.633-1.539-6.596-.59-2.578 1.245-3.298 4.49-1.451 6.547.734.818 2.103 1.523 3.222 1.66 2.094.257 3.893-1.312 3.893-3.395 0-1.352-.527-2.123-1.855-2.714-1.814-.806-3.764.136-3.755 1.815.004.716.32 1.165 1.049 1.49.467.208.478.225.097.147-1.664-.34-2.054-2.317-.716-3.629 1.607-1.575 4.93-.88 6.07 1.27.48.903.535 2.702.117 3.788-.935 2.431-3.662 3.71-6.429 3.014-1.883-.474-2.65-.987-4.92-3.29-3.947-4.005-5.479-4.78-11.168-5.655l-1.09-.168 1.24-1.032Z"></path>
      <path fill="currentColor" d="M7.94 5.395C21.12 21.149 30.196 27.65 31.204 29.023c.833 1.134.52 2.153-.907 2.952-.793.444-2.424.894-3.241.894-.924 0-1.241-.35-1.241-.35-.536-.501-.837-.413-3.588-5.222-3.818-5.837-7.013-10.678-7.1-10.76-.202-.187-.199-.18 6.711 11.998 1.116 2.538.222 3.47.222 3.832 0 .735-.204 1.122-1.125 2.134-1.535 1.687-2.221 3.583-2.717 7.506-.555 4.398-2.117 7.505-6.445 12.822-2.534 3.112-2.948 3.683-3.588 4.937-.805 1.58-1.026 2.465-1.116 4.46-.095 2.109.09 3.472.744 5.488.573 1.766 1.17 2.931 2.699 5.263 1.319 2.012 2.078 3.507 2.078 4.092 0 .466.09.466 2.134.012 4.89-1.088 8.862-3.001 11.096-5.346 1.382-1.452 1.707-2.253 1.717-4.242.007-1.3-.04-1.573-.396-2.322-.581-1.218-1.64-2.23-3.971-3.8-3.055-2.058-4.36-3.714-4.72-5.992-.296-1.869.047-3.187 1.737-6.677 1.75-3.612 2.183-5.15 2.476-8.791.19-2.352.452-3.28 1.138-4.024.715-.777 1.36-1.04 3.13-1.278 2.887-.389 4.725-1.124 6.236-2.496 1.311-1.19 1.86-2.336 1.944-4.062l.064-1.308-.733-.841C31.788 24.855 6.164 3 6.001 3c-.035 0 .838 1.078 1.94 2.395Zm6.138 61.217a2.293 2.293 0 0 0-.722-3.048c-.948-.62-2.42-.328-2.42.48 0 .248.138.427.45.585.527.267.565.567.15 1.18-.418.62-.384 1.166.096 1.536.775.598 1.872.27 2.446-.733ZM36.995 37.295c-1.355.41-2.672 1.825-3.08 3.308-.249.906-.108 2.493.265 2.983.602.792 1.184 1.001 2.76.99 3.087-.021 5.77-1.325 6.082-2.955.256-1.336-.923-3.188-2.546-4-.837-.42-2.619-.586-3.48-.326Zm3.608 2.78c.476-.667.268-1.387-.541-1.874-1.542-.927-3.873-.16-3.873 1.275 0 .714 1.216 1.493 2.33 1.493.742 0 1.757-.436 2.084-.895Z" fillRule="evenodd" clipRule="evenodd"></path>
    </svg>
  )
}

export const CoinbaseIcon = ({ size = 24, className = "", ...props }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path fill="currentColor" d="M20.032 28.5c-4.705 0-8.516-3.804-8.516-8.5s3.81-8.5 8.516-8.5a8.51 8.51 0 0 1 8.388 7.083H37C36.276 9.857 28.96 3 20.032 3 10.629 3 3 10.615 3 20s7.629 17 17.032 17C28.959 37 36.276 30.143 37 21.417h-8.58a8.51 8.51 0 0 1-8.388 7.083"/>
    </svg>
  )
}

export const ParaSpaceIcon = ({ size = 24, className = "", ...props }) => {
  return (
    <img
      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAFWUlEQVR4AcWWA5jcahiFU9u2bdvm2ja6drnWVW3btm1ba3uMxeTc+dOmm2KWxXmeM3Hy5lOG4mr+v4o+zgvp9Y5edJStK6Q2LpCX1Lac5be2c4Nong/92N2f9vdfo2hCfaulx/IrKg+GWjuiwMoB+JW2dUaOZzCtTnHl5EuvIAd/l8mLeoZ8hvAOV8xgDvxm2zghZ+Fyugll747bfwKA2NETAZQyHPSfArB3wxOqNBdY2OVh0rSD0NVfBl+/jQiP2IWQ0L3w8D4IDZ2jMDBNLhWAnQskJQaYpXYSQcGrER+fgB+poKAA589fhJnF2pKCkI7ILxbAzEaKuepBePfuHbjasmUrTp8+jW9F0zTWb9gDde275QcwseJjylR75OTk4Fu1aNESEyZMhCodOXJKCfGg7ACW9gr07G2MqKgo/EgtW7bCxInfA5w5cwbDh48Aj8dDaNgmmNvKVQM4cQD0TOIxesYWDLVYjz524eho54bF/24GL04KUZocckE+6AIarI4fP4Fbt27jWwUHh4CiKLx5+xZisRhqmgeKByCULefqYEp6FqbxhF9841w63hxNLfSxVHy8kIGEOzlIfy2EIFGGXHEBuFq6dCkqVKigLNZ4EIWF7ykOgFaGuwAtpqqD+3DdNAF5aIn8/nQ6Eu7mIDtKAqlAjqioaLAihWponq4agDyc5Lt3P3f0XbsBM7NEUE8Vw/MtA1Amx93IBi9WAkU+jdevX2Ou5r1iAJQ2tsxGvYZdMcrvb8z23wR1A3NIs/MgTJUjJ1qC9FdCJD3gIeZqFt6dTCsRCDnv1uW3GDt9p2oAC7t8sBCaei9Rq1ZrdOw/FmOnqqMo5UkLIEyRI+2lENGXMlVC7L2VidH3H2GkyXYySb8HMLfNZQ6wIAZmKWjXXo0pJJlMhpJKLsxHxlsRU6RcgOBXOUxNTUnLxACXlWw9cABs5CAQXBAdw4+klbgDqOSiwXRH1MUMPD+eCsMkIdTSRJibLsLsTCEGh26BnnEsA2BHAMxsJDC3kSkBCkFIFAhAeno6yipaQWPpzouwey6B/UsZbF7LYPFBCqM4CYY4LS0EMLUWgUBwQYwteQSAmWZl1dGjR1GpUiV0HjoVS87yEHI9H4G382C+6x4GzPUBaX8GgMx7U2shuCAGpimoVq0aFAoFyqK1a9ehQdOWaN1tMDoNGI9x+l4YMs0afYfNw7hJO78Uox35Fhhb5sDEiodPIAIGZMacSxg0aBCI+Hw+du/eDScnJ/z999/MNlfcr+CVK1cwYcIEVKhYGf0HL8b4yXswY+5l6BhFkVnz/R8SAmBkkcXMAC7IwCGB8PHxgb9/AOrUqYumzUagd193NGk6BDVq1MDUqVPh4OCABQsWwNvbGzo6OmjZsiVJm/Lc4eSh5DP+ubMUxCTkKgDMM0EguCAtW01EgwaN0amLAdS0HyqPZTJp0TdJxPTZ59F3gC/ad9RCm7Yz0bb9XHTpZo5BQ4MxS+06eYHPD88jba3CCmZp51SQTxmapcPIPAMsiKFyvXM3U+WDH5FiZKPCgBmZp8PQLJXAKJ1MlmSb7GfgTawETA19PVvyVYEQgDyK3MDQLA0sCGMLNirZX6LCwjDr5BgnamQ/KeQftTQLwwJxbe+cF0uZWCcnfHobBoRYCcGNiioYYj55a04XiTktLeXC/NCOLvItlLVzsq+BaRKIuWFlo1J+GGJpIZCNnLGFrYwOChINosI2ZVQztUl6wkL8KhguELGzu3gZxWpBZGoLJcQzUuXEvwaGtRCuHoJtezfwKlFc+a9IreHkl7LExDopnUD8ChhHF97Lxf58vZPXxBSr/wFOlVqliyFUYAAAAABJRU5ErkJggg=="
      alt="ParaSpace"
      width={size}
      height={size}
      className={className}
      {...props}
    />
  )
}

export const RabbitIcon = ({ size = 24, color = "currentColor", className = "", ...props }) => (
  <svg
    width={size}
    height={size} // आप चाहे तो height={size + 2} कर सकते हैं क्योंकि ओरिजिनल रेश्यो 20:22 है
    viewBox="0 0 20 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <path
      d="M6.04898 1.5328C5.77502 1.49053 5.76347 1.48557 5.89239 1.46587C6.13945 1.42808 6.72283 1.47958 7.12484 1.57466C8.06336 1.79654 8.91735 2.36494 9.82894 3.37442L10.0711 3.64261L10.4176 3.58721C11.8771 3.35393 13.3619 3.53933 14.6038 4.10994C14.9454 4.26692 15.4841 4.5794 15.5514 4.6597C15.5728 4.6853 15.6122 4.85003 15.6389 5.02582C15.7311 5.63398 15.6849 6.10014 15.4979 6.44831C15.3962 6.63778 15.3905 6.69782 15.4589 6.85997C15.5135 6.98936 15.6658 7.08513 15.8166 7.08492C16.1252 7.08451 16.4574 6.58831 16.6113 5.89789L16.6724 5.62364L16.7935 5.76009C17.4579 6.5087 17.9796 7.52962 18.0693 8.25631L18.0926 8.44578L17.981 8.27353C17.7888 7.97714 17.5957 7.77537 17.3484 7.61264C16.9027 7.31931 16.4314 7.21948 15.1833 7.15406C14.056 7.09498 13.418 6.99921 12.7854 6.79404C11.709 6.445 11.1664 5.98015 9.88789 4.31174C9.31999 3.57068 8.96899 3.16067 8.61984 2.83048C7.82646 2.08022 7.04689 1.68675 6.04898 1.5328Z"
      fill={color}
    />
    <path
      d="M15.8056 3.1874C15.834 2.69082 15.9017 2.36329 16.0379 2.06417C16.0917 1.94577 16.1422 1.84887 16.15 1.84887C16.1578 1.84887 16.1344 1.93626 16.0979 2.04305C15.999 2.33335 15.9827 2.73041 16.0509 3.19236C16.1374 3.77851 16.1866 3.86308 16.8095 4.49624C17.1017 4.79322 17.4415 5.16778 17.5647 5.32859L17.7887 5.62099L17.5647 5.41202C17.2908 5.15648 16.6608 4.65812 16.5216 4.58688C16.4283 4.5391 16.4145 4.53992 16.3569 4.5969C16.3039 4.6494 16.2927 4.72829 16.2853 5.10123C16.2739 5.68248 16.1942 6.05556 16.002 6.4286C15.898 6.63037 15.8816 6.58731 15.9757 6.35957C16.046 6.18953 16.0531 6.11478 16.0526 5.55209C16.0515 4.42152 15.9165 4.14972 15.1251 3.68412C14.9247 3.56616 14.5943 3.39606 14.3911 3.30608C14.1878 3.2161 14.0264 3.13773 14.0322 3.13187C14.0547 3.10969 14.8265 3.33374 15.1371 3.45259C15.5992 3.62938 15.6754 3.65229 15.7316 3.63096C15.7692 3.61667 15.7874 3.5077 15.8056 3.1874Z"
      fill={color}
    />
    <path
      d="M6.58113 5.12149C6.02497 4.35993 5.68086 3.19229 5.75536 2.31943L5.77839 2.04932L5.90499 2.0723C6.14272 2.11543 6.55263 2.26718 6.74457 2.38313C7.2713 2.7013 7.49933 3.12019 7.73132 4.19585C7.79928 4.51092 7.88843 4.86746 7.92946 4.98817C7.9955 5.18246 8.24507 5.63629 8.44797 5.93103C8.59412 6.1433 8.49704 6.24389 8.17398 6.21488C7.68059 6.17058 7.01227 5.71183 6.58113 5.12149Z"
      fill={color}
    />
    <path
      d="M15.1311 10.7894C12.532 9.74852 11.6165 8.84507 11.6165 7.32069C11.6165 7.09636 11.6243 6.91281 11.6338 6.91281C11.6432 6.91281 11.7438 6.98684 11.8572 7.07734C12.3843 7.49779 12.9745 7.67736 14.6083 7.91444C15.5698 8.05396 16.1109 8.16664 16.61 8.33127C18.1963 8.85454 19.1778 9.91646 19.4119 11.3629C19.4799 11.7831 19.44 12.5713 19.3297 12.9867C19.2427 13.3147 18.977 13.9061 18.9066 13.9288C18.8871 13.9351 18.8679 13.8606 18.8629 13.7593C18.8361 13.2162 18.5602 12.6874 18.0968 12.2913C17.5699 11.841 16.862 11.4825 15.1311 10.7894Z"
      fill={color}
    />
    <path
      d="M13.3064 11.2218C13.2738 11.029 13.2174 10.7829 13.1809 10.6748L13.1146 10.4782L13.2377 10.6158C13.4082 10.8061 13.5429 11.0496 13.6571 11.3739C13.7442 11.6215 13.754 11.6951 13.7534 12.0973C13.7527 12.4922 13.7418 12.575 13.6614 12.7978C13.5345 13.1492 13.377 13.3983 13.1128 13.6657C12.638 14.1463 12.0276 14.4124 11.1468 14.5228C10.9937 14.5419 10.5474 14.5743 10.1551 14.5945C9.16633 14.6457 8.51558 14.7514 7.93085 14.9556C7.84678 14.985 7.77172 15.0028 7.7641 14.9952C7.74044 14.9718 8.13855 14.7358 8.46739 14.5782C8.93106 14.3561 9.39262 14.2348 10.4268 14.0636C10.9376 13.9789 11.4652 13.8763 11.5991 13.8354C12.8642 13.4496 13.5145 12.454 13.3064 11.2218Z"
      fill={color}
    />
    <path
      d="M14.4979 13.3263C14.1525 12.588 14.0732 11.8751 14.2624 11.2103C14.2827 11.1392 14.3152 11.0811 14.3348 11.0811C14.3544 11.0811 14.4359 11.1249 14.5159 11.1784C14.675 11.285 14.9941 11.4644 15.8444 11.9255C16.9054 12.5009 17.5104 12.9464 17.9218 13.4554C18.2821 13.9012 18.505 14.4089 18.6123 15.028C18.6731 15.3787 18.6375 16.2225 18.547 16.5757C18.2617 17.6891 17.5987 18.5637 16.6531 19.0741C16.5145 19.1488 16.3901 19.2102 16.3767 19.2105C16.3632 19.2108 16.4137 19.0831 16.4889 18.9268C16.807 18.2654 16.8432 17.622 16.6027 16.9059C16.4554 16.4674 16.1552 15.9324 15.5489 15.0282C14.8441 13.9768 14.6713 13.6971 14.4979 13.3263Z"
      fill={color}
    />
    <path
      d="M4.73535 17.3101C5.69986 16.5001 6.89994 15.9246 7.9931 15.748C8.46422 15.6719 9.24904 15.7021 9.68529 15.8132C10.3846 15.9912 11.0101 16.3898 11.3355 16.8648C11.6534 17.329 11.7898 17.7336 11.9318 18.6336C11.9878 18.9887 12.0488 19.3453 12.0672 19.426C12.1739 19.8924 12.3814 20.2653 12.6386 20.4526C13.0471 20.7499 13.7505 20.7684 14.4424 20.5C14.5598 20.4544 14.6618 20.4229 14.669 20.43C14.694 20.4548 14.3456 20.6868 14.0998 20.8089C13.7691 20.9732 13.5061 21.0367 13.1566 21.0367C12.5229 21.0367 11.9967 20.7161 11.5577 20.0623C11.4713 19.9336 11.2771 19.5482 11.1262 19.2059C10.6626 18.1543 10.4337 17.834 9.89554 17.4834C9.42717 17.1784 8.82312 17.1237 8.3687 17.3453C7.77179 17.6364 7.60525 18.3951 8.03277 18.8759C8.20269 19.067 8.51955 19.2318 8.77865 19.2639C9.26337 19.3239 9.67993 18.9571 9.67993 18.4703C9.67993 18.1543 9.5578 17.9739 9.25033 17.8359C8.83039 17.6475 8.379 17.8678 8.38116 18.2601C8.3821 18.4274 8.45535 18.5325 8.62398 18.6084C8.73216 18.6571 8.73467 18.6609 8.64646 18.6427C8.26115 18.5632 8.17088 18.1012 8.48068 17.7945C8.85263 17.4263 9.62176 17.5888 9.88587 18.0914C9.99684 18.3025 10.0097 18.7229 9.91297 18.9768C9.69646 19.545 9.06517 19.8438 8.42476 19.6812C7.98875 19.5705 7.81122 19.4506 7.28553 18.9121C6.37207 17.9762 6.01745 17.7949 4.70055 17.5904L4.44819 17.5512L4.73535 17.3101Z"
      fill={color}
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0.44926 0.55979C3.4998 4.24228 5.60086 5.76161 5.83435 6.0826C6.02713 6.34765 5.95457 6.58593 5.62431 6.77268C5.44065 6.87651 5.06307 6.98171 4.87401 6.98171C4.66018 6.98171 4.58677 6.89967 4.58677 6.89967C4.46279 6.78271 4.39296 6.80317 3.75628 5.67912C2.87236 4.31495 2.13263 3.18331 2.11245 3.16437C2.06579 3.12055 2.06659 3.12203 3.66615 5.96862C3.92459 6.56192 3.71756 6.7797 3.71756 6.86421C3.71756 7.03611 3.67041 7.12646 3.4572 7.36299C3.10178 7.75736 2.9429 8.20047 2.82821 9.11753C2.69963 10.1455 2.33809 10.8717 1.33613 12.1146C0.749626 12.8421 0.653656 12.9754 0.505663 13.2687C0.319254 13.6379 0.267998 13.8447 0.247224 14.311C0.225267 14.804 0.268031 15.1225 0.419469 15.5939C0.552047 16.0065 0.690435 16.279 1.04422 16.824C1.34953 17.2944 1.52533 17.6439 1.52533 17.7806C1.52533 17.8894 1.54621 17.8895 2.01931 17.7833C3.15151 17.529 4.07085 17.0817 4.58791 16.5337C4.9079 16.1944 4.98303 16.0071 4.98547 15.5422C4.98707 15.2381 4.97631 15.1745 4.89367 14.9995C4.75914 14.7148 4.51424 14.4781 3.97447 14.1111C3.26721 13.6302 2.96514 13.2431 2.88169 12.7107C2.81325 12.2738 2.89265 11.9656 3.28391 11.15C3.68888 10.3058 3.78924 9.94602 3.85713 9.09507C3.90097 8.5453 3.96169 8.32848 4.12051 8.15445C4.28614 7.97297 4.43525 7.91151 4.84517 7.85581C5.51345 7.765 5.93898 7.59304 6.28876 7.27246C6.5922 6.99435 6.71917 6.72638 6.73866 6.32298L6.75345 6.01722L6.58388 5.82059C5.96981 5.10846 0.0380236 0 0.000233728 0C-0.00783924 0 0.194231 0.251923 0.44926 0.55979ZM1.87003 14.8689C2.00887 14.6243 1.9351 14.3099 1.70287 14.1563C1.48343 14.0112 1.14256 14.0795 1.14256 14.2687C1.14256 14.3264 1.17464 14.3684 1.24695 14.4054C1.36871 14.4677 1.37754 14.5378 1.28175 14.681C1.18473 14.826 1.19256 14.9535 1.30384 15.0402C1.48319 15.1799 1.73707 15.103 1.87003 14.8689Z"
      fill={color}
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7.17519 8.0162C6.86146 8.11204 6.55649 8.44275 6.46209 8.78951C6.4045 9.00105 6.43718 9.37214 6.52344 9.48675C6.6628 9.67184 6.79757 9.72061 7.16249 9.71807C7.87695 9.71311 8.49805 9.40834 8.57025 9.02734C8.62944 8.71503 8.35666 8.28221 7.98092 8.0922C7.78703 7.99419 7.37468 7.9553 7.17519 8.0162ZM8.01039 8.66577C8.12056 8.51006 8.07237 8.34178 7.88498 8.22796C7.52814 8.01124 6.9885 8.19058 6.9885 8.52587C6.9885 8.69277 7.26991 8.87487 7.52786 8.87487C7.69955 8.87487 7.9345 8.77304 8.01039 8.66577Z"
      fill={color}
    />
  </svg>
);


const menuItems = [
  // Group 1: Feed, Marketplace, SpadesFI
  { icon: ContentLayoutIcon, label: 'Feed', path: '/feed' },
  { icon: <BiStoreAlt size={24} />
  , label: 'Marketplace', path: '/marketplace' },
  { icon: Spade, label: 'SpadesFI', path: '/spadesfi' },
  // Group 2: D-Drop, Explore, trending
  { icon: Box, label: 'D-Drop', path: '/d-drop' },
  { icon: Search, label: 'Explore', path: '/explore' },
  { icon: Flame, label: 'Trending', path: '/trending' },
  // Group 3: Events, News, Dashboard
  { icon: CalendarDays, label: 'Events', path: '/events' },
  { icon: Newspaper, label: 'News', path: '/news' },
  { icon: LayoutDashboard, label: 'Dashboard', path: '/landing' },
]

// Helper function to format time from timestamp
function formatTime(timestamp?: string): string {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}

interface SidebarProps {
  onClose?: () => void
}

export default function Sidebar({ onClose }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isSpadesFIOpen, setIsSpadesFIOpen] = useState(false)
  const { sidebarOpen, toggleSidebar, setSidebarOpen } = useUIStore()
  const { chats, getChats, isLoading: chatsLoading, typingUsers } = useChatStore()
  const { user, isAuthenticated } = useAuthStore()
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null)
  const buttonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({})
  const chatsFetchedRef = useRef(false)
  const prevPathnameRef = useRef<string>(pathname)

  const isFeedPage = pathname === '/feed'
  const shouldForceFullSidebar = isFeedPage

  // Force sidebar open on feed page, collapse on other pages by default when navigating
  useEffect(() => {
    const pathnameChanged = prevPathnameRef.current !== pathname
    prevPathnameRef.current = pathname

    if (shouldForceFullSidebar && !sidebarOpen) {
      setSidebarOpen(true)
    } else if (!shouldForceFullSidebar && pathnameChanged) {
      // Collapse sidebar when navigating to non-feed pages
      setSidebarOpen(false)
    }
  }, [pathname, shouldForceFullSidebar, sidebarOpen, setSidebarOpen])

  const handleToggleSidebar = () => {
    if (shouldForceFullSidebar) return
    toggleSidebar()
  }

  // Fetch chats only once when sidebar opens for the first time
  useEffect(() => {
    if (sidebarOpen && user && !chatsFetchedRef.current) {
      chatsFetchedRef.current = true
      getChats()
    }
    // Reset when sidebar closes
    if (!sidebarOpen) {
      chatsFetchedRef.current = false
    }
  }, [sidebarOpen, user, getChats])

  // Transform API chats to sidebar format and limit to 3 for sidebar preview
  const chatData = chats.slice(0, 3).map((chat) => {
    // Get the other participant (not current user)
    const otherParticipant = chat.participants?.find(
      (p) => p._id !== user?.id && p._id !== (user as any)?._id
    ) || chat.participants?.[0]

    // Check if user is typing
    const chatTypingUsers = typingUsers[chat._id] || []
    const isTyping = chatTypingUsers.length > 0 && chatTypingUsers.some(
      (userId) => userId !== user?.id && userId !== (user as any)?._id
    )

    // Get last message text
    const messageText = chat.lastMessage?.message || ''
    const isCurrentUserSender = chat.lastMessage?.senderId === user?.id ||
      chat.lastMessage?.senderId === (user as any)?._id
    const displayMessage = isTyping
      ? '...is typing'
      : (isCurrentUserSender && messageText ? `You: ${messageText}` : messageText)

    return {
      id: chat._id,
      userId: otherParticipant?._id || '',
      name: otherParticipant?.name || otherParticipant?.username || 'Unknown User',
      message: displayMessage,
      time: formatTime(chat.lastMessage?.timestamp || chat.updatedAt),
      profilePicture: otherParticipant?.profilePicture,
      isTyping,
      unread: chat.unreadCount || 0,
    }
  })

  const handleNavigation = (path: string, label: string) => {
    // For coming soon items, navigate to route and let the page handle the modal
    router.push(path)
    if (onClose) {
      onClose()
    }
  }

  const handleSpadesFIClick = () => {
    if (!sidebarOpen) {
      setSidebarOpen(true)
      setTimeout(() => setIsSpadesFIOpen(true), 0)
      return
    }
    setIsSpadesFIOpen((prev) => !prev)
  }

  // SpadesFI dropdown items
  const spadesFIItems = [
    { icon: CoinbaseIcon, label: 'CoinBase', path: '/spadesfi/coinbase' },
    { icon: UniswapIcon, label: 'Uniswap', path: '/spadesfi/uniswap' },
    { icon: AaveIcon, label: 'Aave', path: '/spadesfi/aave' },
    { icon: ParaSpaceIcon, label: 'ParaSpace', path: '/spadesfi/paraspace' },
  ]

  return (
    <aside className={`${sidebarOpen ? 'w-72' : 'w-32'} h-full overflow-y-auto scrollbar-hide bg-transparent transition-all duration-300 mt-25 md:mt-6 ${!sidebarOpen ? 'overflow-x-visible' : ''}`}>
      {/* Combined Container */}
      <div className={`${sidebarOpen ? 'px-4' : 'px-2'} pt-4 pb-4 ${!sidebarOpen ? 'overflow-visible' : ''}`}>
        <div className={`rounded-lg bg-[#090721] border border-[#2A2F4A] ${!sidebarOpen ? 'overflow-visible' : ''}`}>
          {!isFeedPage && (
            <div className="flex justify-center border-b border-[#2A2F4A]">
              <button
                onClick={handleToggleSidebar}
                className="p-1.5 rounded-lg text-white transition-colors cursor-pointer"
                title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
              >
                <Image src={image22} alt="Toggle sidebar" width={40} height={40} className="object-contain" />
              </button>
            </div>
          )}

          {/* Menu Items */}
          <nav className={!sidebarOpen ? 'overflow-visible' : ''}>
            {menuItems.map((item, idx) => {
              const Icon = item.icon
              const isIconElement = React.isValidElement(Icon)
              const IconComponent = isIconElement ? null : Icon as React.ComponentType<any>
              const isActive = pathname === item.path || (item.label === 'SpadesFI' && pathname.startsWith('/spadesfi'))
              const isSpadesFI = item.label === 'SpadesFI'

              return (
                <div key={item.path}>
                  {isSpadesFI ? (
                    <div className="relative group">
                      <button
                        ref={(el) => {
                          buttonRefs.current[item.path] = el
                        }}
                        onMouseEnter={() => {
                          if (!sidebarOpen && buttonRefs.current[item.path]) {
                            const rect = buttonRefs.current[item.path]!.getBoundingClientRect()
                            setTooltipPosition({ x: rect.right + 8, y: rect.top + rect.height / 2 })
                            setHoveredItem(item.path)
                          }
                        }}
                        onMouseLeave={() => {
                          setHoveredItem(null)
                          setTooltipPosition(null)
                        }}
                        onClick={handleSpadesFIClick}
                        className={`cursor-pointer relative flex items-center ${sidebarOpen ? 'justify-between' : 'justify-center'} gap-3 ${sidebarOpen ? 'px-4' : 'px-2'} py-3 w-full transition-colors ${
                          isActive
                            ? 'text-[#FFB600] bg-[#7E6BEF0A]'
                            : 'text-[#A3AED0] hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {isIconElement ? (
                            Icon
                          ) : IconComponent ? (
                            <IconComponent
                              className={`w-6 h-6 flex-shrink-0 ${
                              isActive ? 'text-[#FFB600]' : 'text-[#A3AED0]'
                            }`}
                            strokeWidth={1.5}
                          />
                          ) : null}
                          {sidebarOpen && (
                            <span className="text-sm font-exo2">{item.label}</span>
                          )}
                        </div>
                        {sidebarOpen && (
                          <ChevronDown
                            className={`w-4 h-4 transition-transform ${isSpadesFIOpen ? 'rotate-180' : ''} ${isActive ? 'text-[#FFB600]' : 'text-white'}`}
                          />
                        )}
                        {isActive && sidebarOpen && (
                          <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#FFB600] rounded-l"></span>
                        )}
                      </button>

                      {/* SpadesFI Dropdown */}
                      {isSpadesFIOpen && sidebarOpen && (
                        <div className="border-[#2A2F4A] ml-4 px-4 w-">
                          {spadesFIItems.map((subItem) => {
                            const isSubActive = pathname === subItem.path
                            const SubIcon = subItem.icon
                            return (
                              <button
                                key={subItem.path}
                                onClick={() => handleNavigation(subItem.path, subItem.label)}
                                className={`cursor-pointer w-full flex items-center gap-3 px-4 py-2.5 pl-8 text-sm font-exo2 transition-colors ${isSubActive
                                    ? 'text-[#FFB600] bg-[#7E6BEF0A]'
                                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                                  }`}
                              >
                                {SubIcon && (
                                  <SubIcon
                                    className={`w-4 h-4 flex-shrink-0 ${
                                      isSubActive ? 'text-[#FFB600]' : 'text-gray-300'
                                    }`}
                                    strokeWidth={1.5}
                                  />
                                )}
                                {subItem.label}
                              </button>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="relative group">
                      <button
                        ref={(el) => {
                          buttonRefs.current[item.path] = el
                        }}
                        onMouseEnter={() => {
                          if (!sidebarOpen && buttonRefs.current[item.path]) {
                            const rect = buttonRefs.current[item.path]!.getBoundingClientRect()
                            setTooltipPosition({ x: rect.right + 8, y: rect.top + rect.height / 2 })
                            setHoveredItem(item.path)
                          }
                        }}
                        onMouseLeave={() => {
                          setHoveredItem(null)
                          setTooltipPosition(null)
                        }}
                        onClick={() => handleNavigation(item.path, item.label)}
                        className={`cursor-pointer relative flex items-center mt-1 ${sidebarOpen ? 'gap-3' : 'justify-center'} ${sidebarOpen ? 'px-4' : 'px-2'} py-3 w-full transition-colors ${
                          isActive
                            ? 'text-[#FFB600] bg-[#7E6BEF0A]'
                            : 'text-[#A3AED0] hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {isIconElement ? (
                          Icon
                        ) : IconComponent ? (
                          <IconComponent
                            className={`w-6 h-6 flex-shrink-0 ${
                            isActive ? 'text-[#FFB600]' : 'text-[#A3AED0]'
                          }`}
                          strokeWidth={1.5}
                        />
                        ) : null}
                        {sidebarOpen && (
                          <span className="text-sm font-exo2">{item.label}</span>
                        )}
                        {isActive && sidebarOpen && (
                          <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#FFB600] rounded-l"></span>
                        )}
                      </button>
                    </div>
                  )}
                  {/* Separators after every 3 items (after idx 2, 5) */}
                  {(idx === 2 || idx === 5) && <div className="mx-4 h-px bg-[#2A2F4A]" />}
                </div>
              )
            })}
          </nav>

          {/* Separator Line between Navigation and Chat */}
          {sidebarOpen && isAuthenticated && user && <div className="mx-4 my-2 h-px bg-[#2A2F4A]"></div>}

          {/* Chat Section */}
          {sidebarOpen && isAuthenticated && user && (
            <div className="p-4">
              {/* Chat Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white text-lg font-audiowide font-bold">Chat</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleNavigation('/messages', 'Messages')}
                    className="cursor-pointer text-white hover:text-gray-300 transition-colors"
                    title="New Message"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                  <button className="cursor-pointer text-white hover:text-gray-300 transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Filter */}
              <div className="mb-4">
                <button className="text-white text-sm font-exo2 relative pb-1.5">
                  All
                  <span className="absolute bottom-0 left-0 right-0 h-[1px] bg-white"></span>
                </button>
              </div>

              {/* Chat List */}
              <div className="space-y-2.5 mb-4">
                {chatsLoading ? (
                  <div className="text-center text-gray-400 py-4 text-sm">Loading chats...</div>
                ) : chatData.length === 0 ? (
                  <div className="text-center text-gray-400 py-4 text-sm">No chats yet</div>
                ) : (
                chatData.map((chat) => {
                  const hasProfilePicture = Boolean(
                    chat.profilePicture && chat.profilePicture.trim() !== ''
                  )
                  const profileSrc = hasProfilePicture ? chat.profilePicture! : '/post/card-21.png'
                    return (
                      <div
                        key={chat.id}
                        onClick={() => handleNavigation(`/messages?chat=${chat.id}&userId=${chat.userId}`, 'Messages')}
                        className="flex items-center gap-3 py-2 px-1 hover:bg-white/5 rounded-lg cursor-pointer transition-colors"
                      >
                        {/* Profile Picture */}
                        <div
                          className="flex items-center justify-center w-[40px] h-[40px] sm:w-[48px] sm:h-[48px] rounded-full overflow-hidden p-1.5 sm:p-2"
                          style={
                            hasProfilePicture
                              ? undefined
                              : { background: 'linear-gradient(180deg, #4F01E6 0%, #25016E 83.66%)' }
                          }
                        >
                          {/* Avatar */}
                          <img
                            src={profileSrc}
                            alt="Avatar"
                            className={`w-[32px] h-[32px] sm:w-[40px] sm:h-[40px] ${
                              hasProfilePicture ? 'object-cover' : 'object-contain'
                            }`}
                          />
                        </div>

                        {/* Chat Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-exo2 truncate mb-0.5">{chat.name}</p>
                          <p className={`text-xs truncate ${chat.isTyping ? 'text-gray-400 italic' : 'text-gray-400'}`}>
                            {chat.message}
                          </p>
                        </div>

                        {/* Right Side - Time, Badge, Arrow */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-gray-400 text-xs whitespace-nowrap">{chat.time}</span>
                          {chat.unread > 0 ? (
                            <div className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center">
                              <span className="text-white text-[10px] font-exo2">{chat.unread}</span>
                            </div>
                          ) : (
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                      </div>
                    )
                  })
                )}
              </div>

              {/* View All */}
              <button
                onClick={() => handleNavigation('/messages', 'Messages')}
                className="cursor-pointer flex items-center gap-1 text-white text-sm font-exo2 hover:text-gray-300 transition-colors"
              >
                View All
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tooltip Portal - Renders outside sidebar to avoid overflow clipping */}
      {!sidebarOpen && hoveredItem && tooltipPosition && typeof window !== 'undefined' && createPortal(
        <div
          className="fixed px-3 py-1.5 bg-[#1a1a2e] text-white text-sm font-exo2 rounded-lg whitespace-nowrap z-[9999] border border-[#2A2F4A] shadow-xl pointer-events-none"
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
            transform: 'translateY(-50%)',
          }}
        >
          {menuItems.find(item => item.path === hoveredItem)?.label}
          <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-t-transparent border-r-4 border-r-[#1a1a2e] border-b-4 border-b-transparent"></div>
        </div>,
        document.body
      )}

    </aside>
  )
}