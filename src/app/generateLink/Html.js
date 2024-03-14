import datepipeModel from '@/models/datepipemodel';
import React from 'react';
import Layout from '../components/global/layout';

const Html = () => {

    return (
        <>
            <Layout handleKeyPress={''} setFilter={''} reset={''} filter={''} name="Generate Link" filters={''} >
                <div className='sidebar-left-content'>

                
                <div class="card">
                    <div className='card-header'>
                        <div className='main_title_head d-flex justify-content-between align-items-center'>
                                <h3 class="link_default m-0"><i class="fa fa-bullhorn link_icon" aria-hidden="true"></i> Default Links
                                </h3>

                                <div className=''>
                                    <div class="d-flex align-items-center gap-3">

                                    <div class="dropdown">
                                        <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            DYNAMIC PARAMETERS
                                        </button>
                                        <div class="dropdown-menu width_menu" aria-labelledby="dropdownMenuButton">
                                            <div class="d-flex align-items-center gap-3 justify-content-between px-2 border-bottom">
                                                <div class="form-check">
                                                    <input class="form-check-input" type="checkbox" id="gridCheck"/>
                                                        <label class="form-check-label" for="gridCheck">
                                                            Tracking Code
                                                        </label>
                                                </div>
                                                <div class="d-flex gap-3 align-items-center">
                                                    <input type="email" class="form-control" id="inputEmail4" placeholder="Email"/>
                                                        <i class="fa fa-times class-bx" aria-hidden="true"></i>

                                                </div>
                                            </div>
                                            <p class=""></p>
                                            <ul>
                                                <li>    <div class="form-check">
                                                    <input class="form-check-input" type="checkbox" id="gridCheck"/>
                                                        <label class="form-check-label" for="gridCheck">
                                                            Tracking Code
                                                        </label>
                                                </div></li>
                                                <li>    <div class="form-check">
                                                    <input class="form-check-input" type="checkbox" id="gridCheck"/>
                                                        <label class="form-check-label" for="gridCheck">
                                                            Tracking Code
                                                        </label>
                                                </div></li>

                                                <li>    <div class="form-check">
                                                    <input class="form-check-input" type="checkbox" id="gridCheck"/>
                                                        <label class="form-check-label" for="gridCheck">
                                                            Tracking Code
                                                        </label>
                                                </div></li>

                                                <li>    <div class="form-check">
                                                    <input class="form-check-input" type="checkbox" id="gridCheck"/>
                                                        <label class="form-check-label" for="gridCheck">
                                                            Tracking Code
                                                        </label>
                                                </div></li>  <li>    <div class="form-check">
                                                    <input class="form-check-input" type="checkbox" id="gridCheck"/>
                                                        <label class="form-check-label" for="gridCheck">
                                                            Tracking Code
                                                        </label>
                                                </div></li>
                                            </ul>


                                        </div>
                                    </div>


                                    <div className='select_one'>
                                        <select className='selectwidth '>
                                            <option>One</option>
                                            <option>One</option>
                                            <option>One</option>
                                        </select>
                                    </div>
                                </div>
                                </div>
                        </div>
                  
                    </div>
                    <div className='card-body'>
                    <h2 class="fiver_cpa">Fiverr CPA</h2>
                        <div class="input-group mb-2">

                            <div class="input-group-prepend">
                                <div class="input-group-text"><i class="fa fa-clipboard copy_icon" aria-hidden="true"></i>
                                </div>
                            </div>
                            <p class="form-control mb-0" ></p>
                        </div>
                    </div>
                   
                </div>
                </div>
            </Layout>
        </>
    );
};

export default Html;
