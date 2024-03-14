import datepipeModel from '@/models/datepipemodel';
import React from 'react';
import Layout from '../components/global/layout';

const Html = () => {

    return (
        <>
            <Layout handleKeyPress={''} setFilter={''} reset={''} filter={''} name="Generate Link" filters={''} >
                <section class="fiver_bx bg-white">
                    <div class="container">
                        <h3 class="link_default"><i class="fa fa-bullhorn link_icon" aria-hidden="true"></i> Default Links
                        </h3>
                        <div class="text-right">

                            <div class="dropdown">
                                <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
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


                            <div class="btn-group">
                                <button type="button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    Right-aligned menu
                                </button>
                                <div class="dropdown-menu dropdown-menu-right">
                                    <button class="dropdown-item" type="button">Action</button>
                                    <button class="dropdown-item" type="button">Another action</button>
                                    <button class="dropdown-item" type="button">Something else here</button>
                                </div>
                            </div>
                        </div>


                        <h2 class="fiver_cpa">Fiverr CPA</h2>
                        <div class="input-group mb-2">

                            <div class="input-group-prepend">
                                <div class="input-group-text"><i class="fa fa-clipboard copy_icon" aria-hidden="true"></i>
                                </div>
                            </div>
                            <p class="form-control mb-0" ></p>
                        </div>
                    </div>
                </section>
            </Layout>
        </>
    );
};

export default Html;
